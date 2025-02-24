// backend/controllers/customerController.js

const Customer = require('../models/Customer');
const Agent = require('../models/Agent');

// GET all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().populate('agent', 'name email');
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error: error.message });
  }
};

// GET a specific customer by ID
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate('agent', 'name email');
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer', error: error.message });
  }
};

// POST a new customer
const createCustomer = async (req, res) => {
  const { name, email, phone, agent } = req.body;

  try {
    // Check if the assigned agent exists
    const agentExists = await Agent.findById(agent);
    if (!agentExists) {
      return res.status(404).json({ message: 'Assigned agent not found' });
    }

    // Check if the customer email already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer with this email already exists' });
    }

    // Create a new customer
    const newCustomer = new Customer({
      name,
      email,
      phone,
      agent,
    });

    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating customer', error: error.message });
  }
};

// PUT to update an existing customer
const updateCustomer = async (req, res) => {
  const { name, email, phone, agent } = req.body;

  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Update customer details
    customer.name = name || customer.name;
    customer.email = email || customer.email;
    customer.phone = phone || customer.phone;
    customer.agent = agent || customer.agent;

    const updatedCustomer = await customer.save();
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer', error: error.message });
  }
};

// DELETE a customer
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await customer.remove();
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error: error.message });
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
