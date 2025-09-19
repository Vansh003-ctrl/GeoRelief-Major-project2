const Resource = require('../models/Resource');

// Naya resource add karne ka logic
exports.addResource = async (req, res) => {
  try {
    console.log("📩 Incoming Resource:", req.body); // log request data
    const newResource = new Resource(req.body);
    const resource = await newResource.save();
    console.log("✅ Saved Resource:", resource); // confirm save
    res.json(resource);
  } catch (err) {
    console.error("❌ Error saving resource:", err.message);
    res.status(500).send("Server error");
  }
};


// Sabhi resources ko fetch karne ka logic
exports.getResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Existing resource ko update karne ka logic
exports.updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Update hone ke baad naya data return karega
    );
    if (!resource) {
      return res.status(404).json({ msg: 'Resource not found' });
    }
    res.json(resource);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Resource ko delete karne ka logic
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) {
      return res.status(404).json({ msg: 'Resource not found' });
    }
    res.json({ msg: 'Resource removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};