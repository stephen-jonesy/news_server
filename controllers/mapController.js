const { selectJSON } = require("../models/map.model");

exports.getJSON = (req, res, next) => {
    selectJSON()
    .then((result) => {
        const JSONdata = JSON.stringify(result)
        res.status(200).send({data: JSONdata});
  
    })
    .catch((err) => {
        next(err);

    })
}