const Sauce = require('../models/sauce');
const fs = require('fs'); //file system

//Create new Sauce
exports.createSauce = (req, res, next) => {
    req.body.sauce = JSON.parse(req.body.sauce);
    const url = req.protocol + '://' + req.get('host');
    const sauce = new Sauce({
        userId: req.body.sauce.userId,
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper,
        imageUrl: url + '/images/' + req.file.filename,
        heat: req.body.sauce.heat,
        likes: req.body.sauce.likes,
        dislikes: req.body.sauce.dislikes,
        usersLiked: req.body.sauce.usersLiked,
        usersDisliked: req.body.sauce.usersDisliked,
    });
    sauce.save().then(() => {
        res.status(201).json({
            message: 'Sauce successfully created!'
        });
    }).catch((error) => {
        res.status(400).json({
            error: error
        });
    });
};

//Display one specifid Sauce by ID
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }).catch((error) => {
            res.status(404).json({
                error: error
            });
        });
    console.log('Sauce successfully displayed!');
};

//Modify one specific Sauce by ID
exports.modifySauce = (req, res, next) => {
    let sauce = new Sauce({ _id: req.params._id });
    if (req.file) { //If the file will be updated
        req.body.sauce = JSON.parse(req.body.sauce);
        Sauce.findOne({ _id: req.params.id }).then((sauce) => {  //to delete old image when modifying
            const filename = sauce.imageUrl.split('/images')[1];
            fs.unlink('images/' + filename, (error) => {
                if (error) {
                    console.log('Failed to replace image!' + error);
                } else {
                    console.log('Successfully replaced image!');
                };
            });
        }).catch((error) => {
            res.status(400).json({
                error: error
            });
        });
        const url = req.protocol + '://' + req.get('host');
        sauce = { //Modify sauce's below parameters
            _id: req.params.id,
            userId: req.body.sauce.userId,
            name: req.body.sauce.name,
            manufacturer: req.body.sauce.manufacturer,
            description: req.body.sauce.description,
            mainPepper: req.body.sauce.mainPepper,
            imageUrl: url + '/images/' + req.file.filename,
            heat: req.body.sauce.heat,
        };
    } else { //If no file is edited
        sauce = {
            _id: req.params.id,
            userId: req.body.userId,
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            description: req.body.description,
            mainPepper: req.body.mainPepper,
            imageUrl: req.body.imageUrl,
            heat: req.body.heat,
        };
    }
    Sauce.updateOne({ _id: req.params.id }, sauce).then(() => {
        res.status(201).json({
            message: 'Sauce successfully updated!'
        });
    }).catch((error) => {
        res.status(400).json({
            error: error
        });
    });
};

//Delete one specific Sauce by ID
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
        const filename = sauce.imageUrl.split('/images')[1];
        fs.unlink('images/' + filename, () => {
            Sauce.deleteOne({ _id: req.params.id }).then(() => {
                res.status(200).json({
                    message: "Sauce deleted!"
                });
            }).catch((error) => {
                res.status(400).json({
                    error: error
                });
            });
        });
    });
};

//Display all Sauces from database
exports.getAllSauces = (req, res, next) => {
    Sauce.find().then((sauces) => {
        res.status(200).json(sauces);
    }).catch((error) => {
        res.status(400).json({
            error: error
        });
    });
};

//Like or Dislike a Sauce
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
        if (req.body.like == 1) { //like=1 Add like and userID to likes array
            sauce.usersLiked.push(req.body.userId);
            sauce.likes += req.body.like;
        } else if (req.body.like == 0 && sauce.usersLiked.includes(req.body.userId)) { //like=0 & userID in like array, remove like and userID
            sauce.usersLiked.remove(req.body.userId);
            sauce.likes -= 1;
        } else if (req.body.like == -1) { //like=-1 Add dislike and userID to dislike array
            sauce.usersDisliked.push(req.body.userId);
            sauce.dislikes += 1;
        } else if (req.body.like == 0 && sauce.usersDisliked.includes(req.body.userId)) { //like=-1 & userID in dislike array, remove dislike and userID
            sauce.usersDisliked.remove(req.body.userId);
            sauce.dislikes -= 1;
        }
        sauce.save().then(() => {
            res.status(201).json({
                message: 'Preference changed!'
            });
        }).catch((error) => {
            res.status(400).json({
                error: error
            });
        });
    });
};