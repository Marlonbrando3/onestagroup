const mongoose = require('mongoose');
const propertySchema = new mongoose.Schema({
    id: {
        type:Number,
    },
    country:{
        type:String,
    },
    favorite:{
        type:Boolean,
    },
    addtohomeview:{
        type:Boolean,
    },
    region: {
        type: String
    },
    city: {
        type: String
    },
    title:{
        type:String,
    },
    market:{
        type:String,
    },
    type:{
        type:String,
    },
    seaview:{
        type:Boolean,
    },
    firstline:{
        type:Boolean,
    },
    bathrooms:{
        type:Number,
    },
    bedrooms:{
        type:Number,
    },
    pool:{
        type:Boolean,
    },
    garden:{
        type:Boolean,
    },
    parking:{
        type:Boolean,
    },
    solarium :{
        type:Boolean,
    },
    sauna:{
        type:Boolean,
    },
    taras :{
        type:Boolean,
    },
    balcony:{
        type:Boolean,
    },
    price:{
        type:Number,
    },
    localization:{
        type:mongoose.Schema.Types.Mixed,
    },
    squaremeters:{
        type:Number,
    },
    description: {
        type:String,
    },
    distance:{
        type:Number,
    },
    owner: {
        type:String,
    },
    image:{
        
    }
})

const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);
export default Property;