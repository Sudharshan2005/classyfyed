import express from "express"
import Product from "../models/Product.js"

const router = express.Router()

// Get recent products (latest 10, sorted by createdAt)
router.get('/recent/:id/:limit', async (req, res) => {
    try {
      const products = await Product.find()
        .sort({ createdAt: -1 })
        .limit(1);
      res.json({ success: true, products });
    } catch (error) {
      console.error('Error fetching recent products:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  
  // Filter products by brandName, genericName, model, or category
  router.get('/filter', async (req, res) => {
    try {
      const { brandName, genericName, model, category } = req.query;
      const query = {};
  
      // Build query object for MongoDB with case-insensitive regex
      if (brandName) query.brandName = { $regex: brandName, $options: 'i' };
      if (genericName) query.genericName = { $regex: genericName, $options: 'i' };
      if (model) query.model = { $regex: model, $options: 'i' };
      if (category) query.category = { $regex: category, $options: 'i' };
  
      const products = await Product.find(query);
      res.json({ success: true, products });
    } catch (error) {
      console.error('Error filtering products:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

router.get('/', async(req, res) => {
    try {
        const products = await Product.find();
        res.status(201).json({ success: true, products });
    }
    catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ success: false, message: error.message || "Server error" });
    }
});

router.get('/unverified', async(req, res) => {
    try {
        const products = await Product.find({ status: "inactive" });
        res.status(201).json({ success: true, products });
    }
    catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ success: false, message: error.message || "Server error" });
    }
});

router.post('/add', async (req, res) => {
    try {
        const {brandName, mobile, genericName, originalPrice, discountPrice, vendorId, category, subCategory, stock, sales, model, color, weight, variants, description, reviews, status, images} = req.body;

        if (!brandName || !genericName || !originalPrice || !discountPrice || !category || !stock || !images?.length || !vendorId || !subCategory) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
          }
      
        const existingProduct = await Product.findOne({ brandName: brandName.trim(), model: model?.trim(), mobile: mobile?.trim() });
        if (existingProduct) {
            return res.status(409).json({ success: false, message: "Product with the same brand and model already exists." });
        }

        const product = new Product({
            brandName,
            mobile,
            genericName,
            originalPrice,
            discountPrice,
            vendorId,
            category,
            subCategory,
            stock,
            sales,
            model,
            color,
            weight,
            variants,
            description,
            reviews,
            status,
            images
        })
        await product.save();

        res.status(201).json({ success: true, message: "Product Added Successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ success: false, message: error.message || "Server error" });
    }
});

router.patch('/:id/verify', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, { status: "active" }, { new: true });
        if(!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(201).json({ success: true, message: "Product Verified Successfully" });
    } catch(e) {
        console.error("Error registering user:", error);
        res.status(500).json({ success: false, message: error.message || "Server error" });
    }
});

router.delete("/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      const user = await Product.findByIdAndDelete(id);
  
      if (!user) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
  
      res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  router.get('/:userId', async(req, res) => {
    try {

      const { userId } = req.params;

        const products = await Product.find();
        res.status(201).json({ success: true, products });
    }
    catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ success: false, message: error.message || "Server error" });
    }
});

export default router