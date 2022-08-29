const Sauce = require("../models/sauce");
const fs = require('fs');


exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
}

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    
    const sauce = new Sauce({
        ...sauceObject,
        userId : req.auth.userId,
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    
    sauce.save()
    .then(() => { res.status(201).json({ message : "Sauce enregistrée ! "})})
    .catch(error => { res.status(400).json({ error })});
};


exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    { 
    ...JSON.parse(req.body.sauce),
    imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body};

    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        if(sauce.userId != req.auth.userId){
            res.status(401).json({ message: 'Non autorisé !'});
        } else {
            Sauce
            .updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
            .catch((error) => res.status(400).json({ error }));

        }
    })
    .catch((error) => {
        res.status(400).json({ error });
    });
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        if(sauce.userId != req.auth.userId){
            res.status(401).json({message: "Non autorisé"});
        } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
            });
        }
    })
    .catch( error => {
        res.status(500).json({ error });
    });
};

exports.likeSauce = (req, res, next) => {
    const userId = req.body.userId;
    const like = req.body.like;
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (like == 1) {
                sauce.usersLiked.push(userId);
                sauce.likes += 1;
                sauce.save()
                    .then(() => {
                        res.status(200).json({ message: 'Sauce likée !' })
                    })
                    .catch(error => res.status(500).json({ error }));
            } else if (like == 0) {
                if (sauce.usersLiked.includes(userId)) {
                    sauce.usersLiked.pull(userId);
                    sauce.likes -= 1;
                    sauce.save()
                        .then(() => {
                            res.status(200).json({ message: "Like a été enlevé" })
                        })
                        .catch(error => res.status(500).json({ error }));
                } else if (sauce.usersDisliked.includes(userId)) {
                    sauce.usersDisliked.pull(userId);
                    sauce.dislikes -= 1;
                    sauce.save()
                        .then(() => {
                            res.status(200).json({ message: "Dislike a été enlevé" })
                        })
                        .catch(error => res.status(500).json({ error }));
                }
            }
            else if (like == -1) {
                sauce.usersDisliked.push(userId);
                sauce.dislikes += 1;
                sauce.save()
                    .then(() => {
                        res.status(200).json({ message: 'Vous n\'apprécier pas cette sauce !' })
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};
