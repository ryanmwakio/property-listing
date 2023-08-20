const path = require('path');
const fs = require('fs');

const bcrypt = require('bcrypt');
const axios = require('axios');
const User = require('../../models').User;
const UserType = require('../../models').UserType;
const Listing = require('../../models').Listing;
const Review = require('../../models').Review;
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const rootDir = require('../../utils/path');
const Sequelize = require('sequelize');

let Op = Sequelize.Op;

exports.postCreateListing = async (req, res) => {
  try {
    const {
      featured,
      title,
      description,
      location,
      city,
      price,
      bedrooms,
      bathrooms,
      sqft,
      type,
      yearBuilt,
      parking,
      pets,
      furnished,
      wifi,
      forRent,
      forSale,
      img1,
      img2,
      img3,
      img4,
      img5,
      video,
      floorplan,
      available,
    } = req.body;

    // ensure the file img1 is provided is of type image
    if (img1) {
      const img1Ext = img1.split('.').pop();
      if (img1Ext !== 'jpg' && img1Ext !== 'jpeg' && img1Ext !== 'png') {
        return res.status(400).json({
          successful: false,
          status: 'error',
          statusCode: 400,
          message: 'image 1 must be a valid image',
          body: {},
          error: ['image 1 must be a valid image'],
        });
      }
    }

    // ensure the file img2 is provided is of type image
    if (img2) {
      const img2Ext = img2.split('.').pop();
      if (img2Ext !== 'jpg' && img2Ext !== 'jpeg' && img2Ext !== 'png') {
        return res.status(400).json({
          successful: false,
          status: 'error',
          statusCode: 400,
          message: 'image 2 must be a valid image',
          body: {},
          error: ['image 2 must be a valid image'],
        });
      }
    }

    // ensure the file img3 is provided is of type image
    if (img3) {
      const img3Ext = img3.split('.').pop();
      if (img3Ext !== 'jpg' && img3Ext !== 'jpeg' && img3Ext !== 'png') {
        return res.status(400).json({
          successful: false,
          status: 'error',
          statusCode: 400,
          message: 'image 3 must be a valid image',
          body: {},
          error: ['image 3 must be a valid image'],
        });
      }
    }

    // ensure the file img4 is provided is of type image
    if (img4) {
      const img4Ext = img4.split('.').pop();
      if (img4Ext !== 'jpg' && img4Ext !== 'jpeg' && img4Ext !== 'png') {
        return res.status(400).json({
          successful: false,
          status: 'error',
          statusCode: 400,
          message: 'image 4 must be a valid image',
          body: {},
          error: ['image 4 must be a valid image'],
        });
      }
    }

    // ensure the file img5 is provided is of type image
    if (img5) {
      const img5Ext = img5.split('.').pop();
      if (img5Ext !== 'jpg' && img5Ext !== 'jpeg' && img5Ext !== 'png') {
        return res.status(400).json({
          successful: false,
          status: 'error',
          statusCode: 400,
          message: 'image 5 must be a valid image',
          body: {},
          error: ['image 5 must be a valid image'],
        });
      }
    }

    // ensure the file video is provided is of type video
    if (video) {
      const videoExt = video.split('.').pop();
      if (videoExt !== 'mp4') {
        return res.status(400).json({
          successful: false,
          status: 'error',
          statusCode: 400,
          message: 'video must be a valid video',
          body: {},
          error: ['video must be a valid video'],
        });
      }
    }

    // ensure the file floorplan is provided is of type image or pdf
    if (floorplan) {
      const floorplanExt = floorplan.split('.').pop();
      if (
        floorplanExt !== 'jpg' &&
        floorplanExt !== 'jpeg' &&
        floorplanExt !== 'png' &&
        floorplanExt !== 'pdf'
      ) {
        return res.status(400).json({
          successful: false,
          status: 'error',
          statusCode: 400,
          message: 'floorplan must be a valid image or pdf',
          body: {},
          error: ['floorplan must be a valid image or pdf'],
        });
      }
    }

    // make sure title is not empty
    if (!title) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'title is required',
        body: {},
        error: ['title is required'],
      });
    }

    // make sure description is not empty
    if (!description) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'description is required',
        body: {},
        error: ['description is required'],
      });
    }

    // make sure location is not empty
    if (!location) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'location is required',
        body: {},
        error: ['location is required'],
      });
    }

    // make sure city is not empty
    if (!city) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'city is required',
        body: {},
        error: ['city is required'],
      });
    }

    // make sure price is not empty
    if (!price) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'price is required',
        body: {},
        error: ['price is required'],
      });
    }

    // make sure bedrooms is not empty
    if (!bedrooms) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'bedrooms is required',
        body: {},
        error: ['bedrooms is required'],
      });
    }

    // make sure bathrooms is not empty
    if (!bathrooms) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'bathrooms is required',
        body: {},
        error: ['bathrooms is required'],
      });
    }

    // make sure sqft is not empty
    if (!sqft) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'sqft is required',
        body: {},
        error: ['sqft is required'],
      });
    }

    // make sure category is not empty
    if (!type) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'category is required',
        body: {},
        error: ['category is required'],
      });
    }

    // make sure yearBuilt is not empty
    if (!yearBuilt) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'yearBuilt is required',
        body: {},
        error: ['yearBuilt is required'],
      });
    }

    // make sure parking is not empty
    if (!parking) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'parking is required',
        body: {},
        error: ['parking is required'],
      });
    }

    // make sure pets is not empty
    if (!pets) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'pets is required',
        body: {},
        error: ['pets is required'],
      });
    }

    // make sure furnished is not empty
    if (!furnished) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'furnished is required',
        body: {},
        error: ['furnished is required'],
      });
    }

    // make sure wifi is not empty
    if (!wifi) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'wifi is required',
        body: {},
        error: ['wifi is required'],
      });
    }

    // check the types being passed in are valid
    if (
      !['apartment', 'house', 'land', 'warehouse', 'commercial'].includes(type)
    ) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message:
          'type must be one of the following: apartment, house, condo, townhouse, land, office, warehouse, commercial',
        body: {},
        error: [
          'type must be one of the following: apartment, house, condo, townhouse, land, office, warehouse, commercial',
        ],
      });
    }

    var img1Name = req.files.img1[0].filename;
    let hostedImg1Path = '';
    let img1AbsolutePath = '';
    if (img1Name) {
      hostedImg1Path =
        req.protocol + '://' + req.get('host') + '/uploads/' + img1Name;
      img1AbsolutePath = path.join(rootDir, 'public', 'uploads', img1Name);
    } else {
      hostedImg1Path =
        req.protocol + '://' + req.get('host') + '/uploads/placeholder.png';
      img1AbsolutePath = path.join(
        rootDir,
        'public',
        'uploads',
        'placeholder.png'
      );
    }

    let img2Name = req.files.img2[0].filename;
    let hostedImg2Path = '';
    let img2AbsolutePath = '';
    if (img2Name) {
      hostedImg2Path =
        req.protocol + '://' + req.get('host') + '/uploads/' + img2Name;
      img2AbsolutePath = path.join(rootDir, 'public', 'uploads', img2Name);
    } else {
      hostedImg2Path =
        req.protocol + '://' + req.get('host') + '/uploads/placeholder.png';
      img2AbsolutePath = path.join(
        rootDir,
        'public',
        'uploads',
        'placeholder.png'
      );
    }

    let img3Name = req.files.img3[0].filename;
    let hostedImg3Path = '';
    let img3AbsolutePath = '';
    if (img3Name) {
      hostedImg3Path =
        req.protocol + '://' + req.get('host') + '/uploads/' + img3Name;
      img3AbsolutePath = path.join(rootDir, 'public', 'uploads', img3Name);
    } else {
      hostedImg3Path =
        req.protocol + '://' + req.get('host') + '/uploads/placeholder.png';
      img3AbsolutePath = path.join(
        rootDir,
        'public',
        'uploads',
        'placeholder.png'
      );
    }

    let img4Name = req.files.img4[0].filename;
    let hostedImg4Path = '';
    let img4AbsolutePath = '';
    if (img4Name) {
      hostedImg4Path =
        req.protocol + '://' + req.get('host') + '/uploads/' + img4Name;
      img4AbsolutePath = path.join(rootDir, 'public', 'uploads', img4Name);
    } else {
      hostedImg4Path =
        req.protocol + '://' + req.get('host') + '/uploads/placeholder.png';
      img4AbsolutePath = path.join(
        rootDir,
        'public',
        'uploads',
        'placeholder.png'
      );
    }

    let img5Name = req.files.img5[0].filename;
    let hostedImg5Path = '';
    let img5AbsolutePath = '';
    if (img5Name) {
      hostedImg5Path =
        req.protocol + '://' + req.get('host') + '/uploads/' + img5Name;
      img5AbsolutePath = path.join(rootDir, 'public', 'uploads', img5Name);
    } else {
      hostedImg5Path =
        req.protocol + '://' + req.get('host') + '/uploads/placeholder.png';
      img5AbsolutePath = path.join(
        rootDir,
        'public',
        'uploads',
        'placeholder.png'
      );
    }

    let videoName = req.files.video[0].filename;
    let hostedVideoPath = '';
    let videoAbsolutePath = '';
    if (videoName) {
      hostedVideoPath =
        req.protocol + '://' + req.get('host') + '/uploads/' + videoName;
      videoAbsolutePath = path.join(rootDir, 'public', 'uploads', videoName);
    } else {
      hostedVideoPath =
        req.protocol + '://' + req.get('host') + '/uploads/placeholder-vid.mp4';
      videoAbsolutePath = path.join(
        rootDir,
        'public',
        'uploads',
        'placeholder-vid.mp4'
      );
    }

    let floorplanName = req.files.floorplan[0].filename;
    let hostedFloorplanPath = '';
    let floorplanAbsolutePath = '';
    if (floorplanName) {
      hostedFloorplanPath =
        req.protocol + '://' + req.get('host') + '/uploads/' + floorplanName;
      floorplanAbsolutePath = path.join(
        rootDir,
        'public',
        'uploads',
        floorplanName
      );
    } else {
      hostedFloorplanPath =
        req.protocol + '://' + req.get('host') + '/uploads/placeholder-pdf.pdf';
      floorplanAbsolutePath = path.join(
        rootDir,
        'public',
        'uploads',
        'placeholder-pdf.pdf'
      );
    }

    // get token from header
    const token = req.headers.authorization;
    const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

    // get more location data
    let url = `http://api.positionstack.com/v1/forward?access_key=${process.env.POSITIONSTACK_KEY}&query=${location}`;
    let response = await axios.get(url);

    let latitude = response.data.data[0].latitude;
    let longitude = response.data.data[0].longitude;
    let region = response.data.data[0].region;
    let county = response.data.data[0].county;

    const listing = await Listing.create({
      featured: false,
      title: title ? title.toLowerCase() : '',
      description: description ? description.toLowerCase() : '',
      location: location ? location.toLowerCase() : 'kasaani',
      city: city ? city.toLowerCase() : 'nairobi',
      county: county ? county.toLowerCase : 'nairobi',
      latitude: latitude || 0,
      longitude: longitude || 0,
      region: region ? region.toLowerCase() : 'nairobi',
      price,
      bedrooms,
      bathrooms,
      sqft,
      type: type ? type.toLowerCase() : '',
      yearBuilt,
      parking,
      pets,
      furnished,
      wifi,
      forRent,
      forSale,
      image1Url: hostedImg1Path,
      image2Url: hostedImg2Path,
      image3Url: hostedImg3Path,
      image4Url: hostedImg4Path || '',
      image5Url: hostedImg5Path || '',
      videoUrl: hostedVideoPath || '',
      floorPlanUrl: hostedFloorplanPath || '',
      image1Name: img1Name,
      image2Name: img2Name,
      image3Name: img3Name,
      image4Name: img4Name || '',
      image5Name: img5Name || '',
      videoName: videoName || '',
      floorPlanName: floorplanName || '',
      available,
      userId: decoded.id,
      createdBy: decoded.email,
      updatedBy: decoded.email,
      views: 0,
      published: false,
      verified: false,
    });

    await listing.save();

    const imagesAbsolutePaths = [
      img1AbsolutePath,
      img2AbsolutePath,
      img3AbsolutePath,
      img4AbsolutePath,
      img5AbsolutePath,
    ];

    const newImg1Name = 'urbcrbs_' + img1Name;
    const newhostedImg1Path = hostedImg1Path.replace(img1Name, newImg1Name);

    const newImg2Name = 'urbcrbs_' + img2Name;
    const newhostedImg2Path = hostedImg2Path.replace(img2Name, newImg2Name);

    const newImg3Name = 'urbcrbs_' + img3Name;
    const newhostedImg3Path = hostedImg3Path.replace(img3Name, newImg3Name);

    const newImg4Name = 'urbcrbs_' + img4Name;
    const newhostedImg4Path = hostedImg4Path.replace(img4Name, newImg4Name);

    const newImg5Name = 'urbcrbs_' + img5Name;
    const newhostedImg5Path = hostedImg5Path.replace(img5Name, newImg5Name);

    await sharp(img1AbsolutePath)
      .resize({ width: 800, height: 500 })
      .toFile(path.join(rootDir, 'public', 'uploads', 'urbcrbs_' + img1Name));
    await sharp(img2AbsolutePath)
      .resize({ width: 800, height: 500 })
      .toFile(path.join(rootDir, 'public', 'uploads', 'urbcrbs_' + img2Name));
    await sharp(img3AbsolutePath)
      .resize({ width: 800, height: 500 })
      .toFile(path.join(rootDir, 'public', 'uploads', 'urbcrbs_' + img3Name));

    if (img4AbsolutePath) {
      await sharp(img4AbsolutePath)
        .resize({ width: 800, height: 500 })
        .toFile(path.join(rootDir, 'public', 'uploads', 'urbcrbs_' + img4Name));
    }

    if (img5AbsolutePath) {
      await sharp(img5AbsolutePath)
        .resize({ width: 800, height: 500 })
        .toFile(path.join(rootDir, 'public', 'uploads', 'urbcrbs_' + img5Name));
    }

    // update db with new image paths using sequelize
    await Listing.update(
      {
        image1Url: newhostedImg1Path,
        image2Url: newhostedImg2Path,
        image3Url: newhostedImg3Path,
        image4Url: newhostedImg4Path || '',
        image5Url: newhostedImg5Path || '',
        image1Name: newImg1Name,
        image2Name: newImg2Name,
        image3Name: newImg3Name,
        image4Name: newImg4Name || '',
        image5Name: newImg5Name || '',
      },
      {
        where: {
          id: listing.id,
        },
      }
    );

    // delete old images
    imagesAbsolutePaths.forEach(async (image) => {
      if (image) {
        await fs.unlink(image, (err) => {
          if (err) throw err;
        });
      }
    });

    // update listing with new image paths and names using sequelize
    await Listing.update(
      {
        image1Url: newhostedImg1Path,
        image2Url: newhostedImg2Path,
        image3Url: newhostedImg3Path,
        image4Url: newhostedImg4Path || img4AbsolutePath,
        image5Url: newhostedImg5Path || img5AbsolutePath,
        image1Name: newImg1Name,
        image2Name: newImg2Name,
        image3Name: newImg3Name,
        image4Name: newImg4Name || img4Name,
        image5Name: newImg5Name || img5Name,
      },
      {
        where: {
          id: listing.id,
        },
      }
    );

    await listing.save();

    // get new listing from db
    const newListing = await Listing.findOne({
      where: {
        id: listing.id,
      },
    });

    await res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listing created successfully',
      body: { newListing },
      error: [],
    });
  } catch (err) {
    return res.json({
      success: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.makePublished = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.json({
        success: false,
        statusCode: 400,
        message: 'Please provide a listing id',
        body: {},
        error: ['Please provide a listing id'],
      });
    }

    // check if listing exists
    const listing = await Listing.findOne({
      where: {
        id,
      },
    });

    if (!listing) {
      return res.json({
        success: false,
        statusCode: 404,
        message: 'Listing not found',
        body: {},
        error: ['Listing not found'],
      });
    }

    // check if user is listing owner or if user is admin or super admin

    const token = req.headers.authorization;
    const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

    // get userTypes from db
    const userTypes = await UserType.findAll();
    let userTypesIds = [];
    userTypes.forEach((userType) => {
      userTypesIds.push(userType.id);
    });

    if (
      decoded.id !== listing.userId &&
      decoded.userTypeId !== userTypes[0] &&
      decoded.userTypeId !== userTypes[1]
    ) {
      return res.json({
        success: false,
        statusCode: 401,
        message: 'You are not authorized to make this listing published',
        body: {},
        error: ['You are not authorized to make this listing published'],
      });
    }

    // update listing with published status to true using sequelize
    await Listing.update(
      {
        published: true,
        updatedBy: decoded.email,
      },
      {
        where: {
          id,
        },
      }
    );

    await listing.save();

    // get new listing from db
    const newListing = await Listing.findOne({
      where: {
        id,
      },
    });

    await res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listing published successfully',
      body: { newListing },
      error: [],
    });
  } catch (err) {
    return res.json({
      success: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.makeUnpublished = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.json({
        success: false,
        statusCode: 400,
        message: 'Please provide a listing id',
        body: {},
        error: ['Please provide a listing id'],
      });
    }

    // check if listing exists
    const listing = await Listing.findOne({
      where: {
        id,
      },
    });

    if (!listing) {
      return res.json({
        success: false,
        statusCode: 404,
        message: 'Listing not found',
        body: {},
        error: ['Listing not found'],
      });
    }

    // check if user is listing owner or if user is admin or super admin
    const token = req.headers.authorization;
    const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

    // get userTypes from db
    const userTypes = await UserType.findAll();
    let userTypesIds = [];
    userTypes.forEach((userType) => {
      userTypesIds.push(userType.id);
    });

    if (
      decoded.id !== listing.userId &&
      decoded.userTypeId !== userTypes[0] &&
      decoded.userTypeId !== userTypes[1]
    ) {
      return res.json({
        success: false,
        statusCode: 401,
        message: 'You are not authorized to make this listing unpublished',
        body: {},
        error: ['You are not authorized to make this listing unpublished'],
      });
    }

    // update listing with published status to false using sequelize
    await Listing.update(
      {
        published: false,
        updatedBy: decoded.email,
      },
      {
        where: {
          id,
        },
      }
    );

    await listing.save();

    // get new listing from db
    const newListing = await Listing.findOne({
      where: {
        id,
      },
    });

    await res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'List listing unpublished successfully',
      body: { newListing },
      error: [],
    });
  } catch (err) {
    return res.json({
      success: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.makeVerified = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.json({
        success: false,
        statusCode: 400,
        message: 'Please provide a listing id',
        body: {},
        error: ['Please provide a listing id'],
      });
    }

    // check if listing exists
    const listing = await Listing.findOne({
      where: {
        id,
      },
    });

    if (!listing) {
      return res.json({
        success: false,
        statusCode: 404,
        message: 'Listing not found',
        body: {},
        error: ['Listing not found'],
      });
    }

    // check if user is listing owner or if user is admin or super admin
    const token = req.headers.authorization;
    const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

    // get userTypes from db
    const userTypes = await UserType.findAll();
    let userTypesIds = [];
    userTypes.forEach((userType) => {
      userTypesIds.push(userType.id);
    });

    if (
      decoded.userTypeId !== userTypes[0].dataValues.id &&
      decoded.userTypeId !== userTypes[1].dataValues.id
    ) {
      return res.json({
        success: false,
        statusCode: 401,
        message: 'You are not authorized to make this listing verified',
        body: {},
        error: ['You are not authorized to make this listing verified'],
      });
    }

    // update listing with published status to false using sequelize
    await Listing.update(
      {
        verified: true,
        updatedBy: decoded.email,
      },
      {
        where: {
          id,
        },
      }
    );

    await listing.save();

    // get new listing from db
    const newListing = await Listing.findOne({
      where: {
        id,
      },
    });

    await res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listing verified successfully',
      body: { newListing },
      error: [],
    });
  } catch (err) {
    return res.json({
      success: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.getListingsByCount = async (req, res) => {
  try {
    //get latest listings by count
    const count = req.query.count || 10;
    const listings = await Listing.findAll({
      order: [['createdAt', 'DESC']],
      limit: count,
    });

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      success: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.getAllListings = async (req, res) => {
  try {
    const listings = await Listing.findAll({
      order: [['createdAt', 'DESC']],
      limit: 30,
    });

    let count = await Listing.count();

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      success: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.getListingById = async (req, res) => {
  try {
    // ensure listing id is valid
    const listingId = req.params.id;

    if (!listingId) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'listing id is required',
        body: {},
        error: ['listing id is required'],
      });
    }

    const listing = await Listing.findOne({
      where: { id: listingId },
    });

    if (!listing) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 404,
        message: 'listing not found',
        body: {},
        error: ['listing not found'],
      });
    }

    // update viewsCount
    listing.views = listing.views + 1;
    await listing.save();

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listing retrieved successfully',
      body: { listing },
      error: [],
    });
  } catch (err) {
    return res.json({
      success: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.paginateListings = async (req, res) => {
  try {
    // get pagination params
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    // paginate using sequelize
    const listings = await Listing.findAll({
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { page: page, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      success: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.updateListing = async (req, res) => {
  try {
    // get listing id
    const listingId = req.params.id;

    // get listing data
    const {
      featured,
      title,
      description,
      location,
      city,
      county,
      price,
      bedrooms,
      bathrooms,
      sqft,
      type,
      yearBuilt,
      parking,
      pets,
      furnished,
      wifi,
      available,
      category,
      forRent,
      forSale,
    } = req.body;

    // if type has been changed, check if it is valid
    if (type) {
      const validTypes = [
        'house',
        'apartment',
        'land',
        'commercial',
        'warehouse',
      ];
      if (!validTypes.includes(type)) {
        return res.json({
          successful: false,
          status: 'error',
          statusCode: 400,
          message: 'type is invalid',
          body: {},
          error: ['type is invalid'],
        });
      }
    }

    // get token from header
    const token = req.headers.authorization;
    const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

    // make sure listing id is valid
    if (!listingId) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'listing id is required',
        body: {},
        error: ['listing id is required'],
      });
    }

    // make sure listing exists
    const listing = await Listing.findOne({
      where: { id: listingId },
    });

    if (!listing) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 404,
        message: 'listing not found',
        body: {},
        error: ['listing not found'],
      });
    }

    // make sure user is authorized to edit listing
    // find all types available in database
    const types = await UserType.findAll({});

    // push all types ids into an array in order to compare
    const idsArray = [];
    types.forEach((type) => {
      idsArray.push(type.id);
    });

    // check if user is authorized to edit listing admin and superadmin are allowed to edit in index 0 and 1

    if (
      listing.userId !== decoded.id &&
      decoded.userTypeId !== idsArray[0] &&
      decoded.userTypeId !== idsArray[1]
    ) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 401,
        message: 'Unauthorized',
        body: {},
        error: ['Unauthorized'],
      });
    }

    let updatedFeatured = listing.featured;

    if (
      featured &&
      (decoded.userTypeId === idsArray[0] || decoded.userTypeId === idsArray[1])
    ) {
      updatedFeatured = featured;
    }

    // get more location data
    let url = `http://api.positionstack.com/v1/forward?access_key=${process.env.POSITIONSTACK_KEY}&query=${location}`;
    let response = await axios.get(url);

    let latitude = response.data.data[0].latitude;
    let longitude = response.data.data[0].longitude;
    let region = response.data.data[0].region;
    let countyapi = response.data.data[0].county;

    // user Types

    // update listing
    await listing.update({
      featured: updatedFeatured,
      title: title ? title.toLowerCase() : listing.title,
      description: description
        ? description.toLowerCase()
        : listing.description,
      location: location ? location.toLowerCase() : listing.location,
      city: city ? city.toLowerCase() : listing.city,
      county: countyapi ? countyapi.toLowerCase() : listing.county,
      longitude: longitude || listing.longitude,
      latitude: latitude || listing.latitude,
      region: region ? region.toLowerCase() : listing.region,
      price: price || listing.price,
      bedrooms: bedrooms || listing.bedrooms,
      bathrooms: bathrooms || listing.bathrooms,
      sqft: sqft || listing.sqft,
      type: type ? type.toLowerCase() : listing.type,
      yearBuilt: yearBuilt || listing.yearBuilt,
      parking: parking || listing.parking,
      pets: pets || listing.pets,
      furnished: furnished || listing.furnished,
      wifi: wifi || listing.wifi,
      available: available || listing.available,
      category: category ? category.toLowerCase() : listing.category,
      forRent: forRent || listing.forRent,
      forSale: forSale || listing.forSale,
      createdBy: decoded.id,

      updatedBy: decoded.email,
    });

    //update views count
    listing.views = listing.views + 1;
    await listing.save();

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listing updated successfully',
      body: { listing },
      error: [],
    });
  } catch (err) {
    return res.json({
      success: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    // get listing id
    const listingId = req.params.id;

    // get token from header
    const token = req.headers.authorization;
    const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

    // make sure listing id is valid
    if (!listingId) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'listing id is required',
        body: {},
        error: ['listing id is required'],
      });
    }

    // make sure listing exists
    const listing = await Listing.findOne({
      where: { id: listingId },
    });

    if (!listing) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 404,
        message: 'listing not found',
        body: {},
        error: ['listing not found'],
      });
    }

    let userTypes = await UserType.findAll({});
    let userTypeIds = [];

    userTypes.forEach((type) => {
      userTypeIds.push(type.id);
    });

    // make sure user is authorized to delete listing
    if (
      listing.userId !== decoded.id &&
      decoded.userTypeId !== userTypeIds[0] &&
      decoded.userTypeId !== userTypeIds[1]
    ) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 401,
        message: 'Unauthorized',
        body: {},
        error: ['Unauthorized'],
      });
    }

    // delete image from server
    const image1Path = path.join(
      __dirname,
      '../../public/uploads/',
      listing.image1Name
    );
    const image2Path = path.join(
      __dirname,
      '../../public/uploads/',
      listing.image2Name
    );
    const image3Path = path.join(
      __dirname,
      '../../public/uploads/',
      listing.image3Name
    );
    const image4Path = path.join(
      __dirname,
      '../../public/uploads/',
      listing.image4Name
    );
    const image5Path = path.join(
      __dirname,
      '../../public/uploads/',
      listing.image5Name
    );

    const videoPath = path.join(
      __dirname,
      '../../public/uploads/',
      listing.videoName
    );

    const floorPlanPath = path.join(
      __dirname,
      '../../public/uploads/',
      listing.floorPlanName
    );

    const pathArray = [
      image1Path,
      image2Path,
      image3Path,
      image4Path,
      image5Path,
      videoPath,
      floorPlanPath,
    ];

    for (let i = 0; i < pathArray.length; i++) {
      if (fs.existsSync(pathArray[i])) {
        fs.unlinkSync(pathArray[i]);
      }
    }

    // delete listing
    await listing.destroy();

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listing deleted successfully',
      body: {},
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.getFeaturedListings = async (req, res) => {
  try {
    // get featured listings
    const listings = await Listing.findAll({
      where: { featured: true },
      limit: 30,
    });

    let count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Featured listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.paginateByLowestPrice = async (req, res) => {
  try {
    // get pagination params
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    // paginate using sequelize
    const listings = await Listing.findAll({
      order: [
        ['price', 'ASC'],
        ['createdAt', 'DESC'],
      ],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;
    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, page: page, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.paginateByHighestPriceFirst = async (req, res) => {
  try {
    // get pagination params
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    // paginate using sequelize
    const listings = await Listing.findAll({
      order: [
        ['price', 'DESC'],
        ['createdAt', 'DESC'],
      ],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;
    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, page: page, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByPriceRange = async (req, res) => {
  try {
    // get price range
    const min = req.query.min;
    const max = req.query.max;

    // get pagination params
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    // paginate using sequelize

    const listings = await Listing.findAll({
      where: { price: { [Op.between]: [min, max] } },
      order: [
        ['price', 'ASC'],
        ['createdAt', 'DESC'],
      ],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;
    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, page: page, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.paginateByBedrooms = async (req, res) => {
  try {
    // get pagination params
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    // paginate using sequelize
    const listings = await Listing.findAll({
      order: [
        ['bedrooms', 'ASC'],
        ['createdAt', 'DESC'],
      ],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;
    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, page: page, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByLocation = async (req, res) => {
  try {
    // get location
    const location = req.query.location;

    // get pagination params
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    // paginate using sequelize
    const listings = await Listing.findAll({
      where: { location },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;
    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, page: page, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByCounty = async (req, res) => {
  try {
    // get county
    const county = req.query.county || 'Nairobi';

    // get pagination params
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    // paginate using sequelize
    const listings = await Listing.findAll({
      where: { county },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;
    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, page: page, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByCombinationOfFilters = async (req, res) => {
  try {
    // get price range
    const min = req.query.min || 0;
    const max = req.query.max || 10000000;

    // get location
    const location = req.query.location || 'Nairobi';

    // get county
    const county = req.query.county || 'Nairobi';

    // get pagination params
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    // paginate using sequelize
    const listings = await Listing.findAll({
      where: {
        price: { [Op.between]: [min, max] },
        location,
        county,
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;
    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, page: page, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByForRent = async (req, res, next) => {
  try {
    const listings = await Listing.findAll({
      where: {
        forRent: true,
      },
    });

    if (!listings) {
      return res.json({
        successful: false,
        statusCode: 404,
        message: 'No listings found',
        body: {},
        error: [],
      });
    }

    const count = listings.length;
    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByForRentAndPriceRange = async (req, res, next) => {
  try {
    const min = req.query.min;
    const max = req.query.max;

    const listings = await Listing.findAll({
      where: {
        forRent: true,
        price: { [Op.between]: [min, max] },
      },
    });
    const count = listings.length;
    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByForSale = async (req, res, next) => {
  try {
    const listings = await Listing.findAll({
      where: {
        forSale: true,
      },
    });

    if (!listings) {
      return res.json({
        successful: false,
        statusCode: 404,
        message: 'No listings found',
        body: {},
        error: [],
      });
    }

    const count = listings.length;
    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.getFeaturedByCount = async (req, res, next) => {
  try {
    const limit = req.query.limit || 3;

    const listings = await Listing.findAll({
      where: {
        featured: true,
      },
      order: [['createdAt', 'DESC']],
      limit: limit,
    });
    const count = listings.length;
    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByMostViewsPaginated = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const listings = await Listing.findAll({
      order: [['views', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });

    if (!listings) {
      return res.json({
        successful: false,
        statusCode: 404,
        message: 'No listings found',
        body: {},
        error: [],
      });
    }

    const count = listings.length;
    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, page: page, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.makeFeatured = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.json({
        successful: false,
        statusCode: 400,
        message: 'No listing id provided',
        body: {},
        error: [],
      });
    }

    const listing = await Listing.findOne({
      where: {
        id: id,
      },
    });

    if (!listing) {
      res.json({
        successful: false,
        status: 'error',
        statusCode: 404,
        message: 'Listing not found',
        body: {},
        error: [],
      });
    } else {
      await listing.update({ featured: true });
      res.json({
        successful: true,
        status: 'success',
        statusCode: 200,
        message: 'Listing updated successfully',
        body: {},
        error: [],
      });
    }
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.removeFeatured = async (req, res, next) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findOne({
      where: {
        id: id,
      },
    });

    if (!listing) {
      res.json({
        successful: false,
        status: 'error',
        statusCode: 404,
        message: 'Listing not found',
        body: {},
        error: [],
      });
    } else {
      await listing.update({ featured: false });
      res.json({
        successful: true,
        status: 'success',
        statusCode: 200,
        message: 'Listing updated successfully',
        body: {},
        error: [],
      });
    }
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.getHousesForRent = async (req, res, next) => {
  try {
    const listings = await Listing.findAll({
      where: {
        forRent: true,
        type: 'house',
      },
    });
    const count = listings.length;
    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.getHousesForSale = async (req, res, next) => {
  try {
    const listings = await Listing.findAll({
      where: {
        forSale: true,
        type: 'house',
      },
    });
    const count = listings.length;
    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.paginateByHouseForRent = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;

    const listings = await Listing.findAll({
      where: {
        forRent: true,
        type: 'house',
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.paginatebyHouseForSale = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;

    const listings = await Listing.findAll({
      where: {
        forSale: true,
        type: 'house',
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByHouseForRentAndPriceRangePaginated = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;
    const { min, max } = req.query;

    const listings = await Listing.findAll({
      where: {
        forRent: true,
        type: 'house',
        price: {
          [Op.between]: [min, max],
        },
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByHouseForSaleAndPriceRangePaginated = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;
    const { min, max } = req.query;

    const listings = await Listing.findAll({
      where: {
        forSale: true,
        type: 'house',
        price: {
          [Op.between]: [min, max],
        },
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByHouseBedroomsPaginated = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;
    const { bedrooms } = req.query || 1;

    const listings = await Listing.findAll({
      where: {
        type: 'house',
        bedrooms: bedrooms,
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByHouseCountyPaginated = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;
    const { county } = req.query || 'Nairobi';

    const listings = await Listing.findAll({
      where: {
        type: 'house',
        county: county,
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByHouseLocationPaginated = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;
    const { location } = req.query || 'Nairobi';

    const listings = await Listing.findAll({
      where: {
        type: 'house',
        location: location,
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByCombinationOfHouseFiltersPaginated = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;

    const { min, max, bedrooms, county, location } = req.query;
    min = min || 0;
    max = max || 10000000;
    bedrooms = bedrooms || 1;
    county = county || 'Nairobi';
    location = location || 'Nairobi';

    const listings = await Listing.findAll({
      where: {
        type: 'house',
        price: {
          [Op.between]: [min, max],
        },
        bedrooms: bedrooms,
        county: county,
        location: location,
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.paginateByApartmentForRent = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;

    const listings = await Listing.findAll({
      where: {
        forRent: true,
        type: 'apartment',
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.paginatebyapartmentForSale = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;

    const listings = await Listing.findAll({
      where: {
        forSale: true,
        type: 'apartment',
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByapartmentForRentAndPriceRangePaginated = async (
  req,
  res,
  next
) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;
    const { min, max } = req.query;
    min = min || 0;
    max = max || 10000000;

    const listings = await Listing.findAll({
      where: {
        forRent: true,
        type: 'apartment',
        price: {
          [Op.between]: [min, max],
        },
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByapartmentForSaleAndPriceRangePaginated = async (
  req,
  res,
  next
) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;
    const { min, max } = req.query;
    min = min || 0;
    max = max || 10000000;

    const listings = await Listing.findAll({
      where: {
        forSale: true,
        type: 'apartment',
        price: {
          [Op.between]: [min, max],
        },
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByapartmentBedroomsPaginated = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;
    const { bedrooms } = req.query;
    bedrooms = bedrooms || 1;

    const listings = await Listing.findAll({
      where: {
        type: 'apartment',
        bedrooms: bedrooms,
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByapartmentCountyPaginated = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;
    const { county } = req.query;
    county = county || 'Nairobi';

    const listings = await Listing.findAll({
      where: {
        type: 'apartment',
        county: county,
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByapartmentLocationPaginated = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;
    const { location } = req.query;
    location = location || 'Nairobi';

    const listings = await Listing.findAll({
      where: {
        type: 'apartment',
        location: location,
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByCombinationOfapartmentFiltersPaginated = async (
  req,
  res,
  next
) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;
    const { bedrooms, county, location } = req.query;
    bedrooms = bedrooms || 1;
    county = county || 'Nairobi';
    location = location || 'Nairobi';

    const listings = await Listing.findAll({
      where: {
        type: 'apartment',
        bedrooms: bedrooms,
        county: county,
        location: location,
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.paginateBylandForRent = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;

    const listings = await Listing.findAll({
      where: {
        forRent: true,
        type: 'land',
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.paginatebylandForSale = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;

    const listings = await Listing.findAll({
      where: {
        forSale: true,
        type: 'land',
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterBylandForRentAndPriceRangePaginated = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;
    const { min, max } = req.query;
    min = min || 0;
    max = max || 10000000;

    const listings = await Listing.findAll({
      where: {
        forRent: true,
        type: 'land',
        price: {
          [Op.between]: [min, max],
        },
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterBylandForSaleAndPriceRangePaginated = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;
    const { min, max } = req.query;
    min = min || 0;
    max = max || 10000000;

    const listings = await Listing.findAll({
      where: {
        forSale: true,
        type: 'land',
        price: {
          [Op.between]: [min, max],
        },
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterBylandCountyPaginated = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;
    const { county } = req.query;
    county = county || 'Nairobi';

    const listings = await Listing.findAll({
      where: {
        type: 'land',
        county: county,
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterBylandLocationPaginated = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;
    const { location } = req.query;
    location = location || 'Nairobi';

    const listings = await Listing.findAll({
      where: {
        type: 'land',
        location: location,
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByCombinationOflandFiltersPaginated = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;
    const { county, location, min, max } = req.query;
    county = county || 'Nairobi';
    location = location || 'Nairobi';
    min = min || 0;
    max = max || 1000000000000;

    const listings = await Listing.findAll({
      where: {
        type: 'land',
        county: county,
        location: location,
        price: {
          [Op.between]: [min, max],
        },
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.paginateByCommercialPropertyForRent = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;

    const listings = await Listing.findAll({
      where: {
        forRent: true,
        type: 'commercial',
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.paginatebyCommercialPropertyForSale = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;

    const listings = await Listing.findAll({
      where: {
        forSale: true,
        type: 'commercial',
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByCommercialPropertyForRentAndPriceRangePaginated = async (
  req,
  res,
  next
) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;
    const { min, max } = req.query;
    min = min || 0;
    max = max || 10000000;

    const listings = await Listing.findAll({
      where: {
        forRent: true,
        type: 'commercial',
        price: {
          [Op.between]: [min, max],
        },
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByCommercialPropertyForSaleAndPriceRangePaginated = async (
  req,
  res,
  next
) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;
    const { min, max } = req.query;
    min = min || 0;
    max = max || 1000000000000;

    const listings = await Listing.findAll({
      where: {
        forSale: true,
        type: 'commercial',
        price: {
          [Op.between]: [min, max],
        },
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByCommercialPropertyCountyPaginated = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;
    const { county } = req.query;
    county = county || 'Nairobi';

    const listings = await Listing.findAll({
      where: {
        type: 'commercial',
        county: county,
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByCommercialPropertyLocationPaginated = async (
  req,
  res,
  next
) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;
    const { location } = req.query;
    location = location || 'Nairobi';

    const listings = await Listing.findAll({
      where: {
        type: 'commercial',
        location: location,
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByCombinationOfCommercialPropertyFiltersPaginated = async (
  req,
  res,
  next
) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;
    const { county, location, min, max } = req.query;
    county = county || 'Nairobi';
    location = location || 'Nairobi';
    min = min || 0;
    max = max || 1000000000000;

    const listings = await Listing.findAll({
      where: {
        type: 'commercial',
        county: county,
        location: location,
        price: {
          [Op.between]: [min, max],
        },
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.paginateByWarehouseForRent = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;

    const listings = await Listing.findAll({
      where: {
        forRent: true,
        type: 'warehouse',
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.paginatebyWarehouseForSale = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;

    const listings = await Listing.findAll({
      where: {
        forSale: true,
        type: 'warehouse',
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByWarehouseCounty = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;
    const { county } = req.query;
    county = county || 'Nairobi';

    const listings = await Listing.findAll({
      where: {
        type: 'warehouse',
        county: county,
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByWarehouseLocation = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;
    const { location } = req.query;
    location = location || 'Nairobi';

    const listings = await Listing.findAll({
      where: {
        type: 'warehouse',
        location: location,
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByWarehousePriceRange = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;
    const { min, max } = req.query;
    min = min || 0;
    max = max || 1000000000000;

    const listings = await Listing.findAll({
      where: {
        type: 'warehouse',
        price: {
          [Op.between]: [min, max],
        },
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByCombinationOfWarehouseFilters = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const limit = req.query.limit || 3;
    const { county, location, min, max } = req.query;
    county = county || 'Nairobi';
    location = location || 'Nairobi';
    min = min || 0;
    max = max || 1000000000000;

    const listings = await Listing.findAll({
      where: {
        type: 'warehouse',
        county: county,
        location: location,
        price: {
          [Op.between]: [min, max],
        },
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });
    const count = listings.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByAllFilters = async (req, res, next) => {
  try {
    let { page, limit, county, min, max, location, forRent, type } = req.query;

    page = page || 1;
    limit = limit || 10;
    county = county ? county : 'Nairobi';
    location = location ? location : 'Kasarani';
    min = min || 0;
    max = max || 1000000000000;
    forRent = forRent || true;
    type = type ? type : 'house';

    let listings = await Listing.findAll({
      where: {
        county: {
          [Op.like]: '%' + county + '%',
        },
        price: {
          [Op.between]: [min, max],
        },
        location: {
          [Op.like]: '%' + location + '%',
        },
        forRent: forRent,
        type: type,
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });

    let count = listings.length;

    if (
      count === 0 ||
      listings === null ||
      listings === undefined ||
      listings === ''
    ) {
      return res.json({
        successful: false,
        statusCode: 404,
        message: 'No listings found',
        body: {},
        error: [],
      });
    }

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count: count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.addReview = async (req, res, next) => {
  try {
    const { review } = req.body;
    let listingId = req.params.id;

    if (!listingId) {
      return res.json({
        successful: false,
        statusCode: 400,
        message: 'Listing id is required',
        body: {},
        error: [],
      });
    }

    if (!review) {
      return res.json({
        successful: false,
        statusCode: 400,
        message: 'Review is required',
        body: {},
        error: [],
      });
    }

    // get token from header
    const token = req.headers.authorization;
    const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

    const userId = decoded.id;

    const listing = await Listing.findOne({
      where: {
        id: listingId,
      },
    });
    if (!listing) {
      return res.json({
        successful: false,
        statusCode: 404,
        message: 'Listing not found',
        body: {},
        error: [],
      });
    }

    const newReview = await Review.create({
      listingId: listingId,
      userId: userId,
      review: review,
    });

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Review added successfully',
      body: { newReview },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.getAllReviews = async (req, res, next) => {
  try {
    const listingId = req.params.id;

    if (!listingId) {
      return res.json({
        successful: false,
        statusCode: 400,
        message: 'Listing id is required',
        body: {},
        error: [],
      });
    }

    const reviews = await Review.findAll({
      where: {
        listingId: listingId,
      },
    });

    if (!reviews) {
      return res.json({
        successful: false,
        statusCode: 404,
        message: 'No reviews found',
        body: {},
        error: [],
      });
    }

    if (reviews.length === 0) {
      return res.json({
        successful: false,
        statusCode: 404,
        message: 'No reviews found for this listing',
        body: {},
        error: [],
      });
    }

    let count = reviews.length;

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Reviews retrieved successfully',
      body: { count, reviews },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.filterByTextFromInput = async (req, res, next) => {
  try {
    // get search term or text from input and set to lowercase to match database and search for any match
    let { text } = req.query;

    if (!text) {
      return res.json({
        successful: false,
        statusCode: 400,
        message: 'Please enter a search text',
        body: {},
        error: [],
      });
    }

    text = text.toLowerCase();

    // get page and limit from input
    let { page, limit } = req.query;
    page = page || 1;
    limit = limit || 10;

    // get listings from database
    let listings = await Listing.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: '%' + text + '%',
            },
          },
          {
            description: {
              [Op.like]: '%' + text + '%',
            },
          },
          {
            county: {
              [Op.like]: '%' + text + '%',
            },
          },
          {
            location: {
              [Op.like]: '%' + text + '%',
            },
          },
          {
            type: {
              [Op.like]: '%' + text + '%',
            },
          },
        ],
      },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: limit,
    });

    // get count of listings
    let count = listings.length;

    // if no listings found
    if (
      count === 0 ||
      listings === null ||
      listings === undefined ||
      listings === ''
    ) {
      return res.json({
        successful: false,
        statusCode: 404,
        message: 'No listings found',
        body: {},
        error: [],
      });
    }

    // return listings
    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Listings retrieved successfully',
      body: { count, listings },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};

exports.removeReview = async (req, res, next) => {
  try {
    let { id } = req.params;

    if (!id) {
      return res.json({
        successful: false,
        statusCode: 400,
        message: 'Review id is required',
        body: {},
        error: [],
      });
    }

    let reviewId = id;

    // get token from header
    const token = req.headers.authorization;
    const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

    const userId = decoded.id;

    // using sequelize
    let review = await Review.findOne({
      where: {
        id: reviewId,
      },
    });

    if (!review) {
      return res.json({
        successful: false,
        statusCode: 404,
        message: 'Review not found',
        body: {},
        error: [],
      });
    }
    let userTypes = await UserType.findAll();
    if (userTypes.length === 0) {
      return res.json({
        successful: false,
        statusCode: 404,
        message: 'No user types found',
        body: {},
        error: [],
      });
    }

    let userTypesIds = userTypes.map((userType) => userType.id);

    // check if user is the owner of the review or if user has userType of admin
    if (
      review.userId !== userId &&
      decoded.userTypeId !== userTypesIds[0] &&
      decoded.userTypeId !== userTypesIds[1]
    ) {
      return res.json({
        successful: false,
        statusCode: 401,
        message: 'You are not authorized to delete this review',
        body: {},
        error: [],
      });
    }

    await review.destroy();

    res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'Review deleted successfully',
      body: {},
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusCode: 500,
      message: err.message,
      body: {},
      error: [err.message],
    });
  }
};
