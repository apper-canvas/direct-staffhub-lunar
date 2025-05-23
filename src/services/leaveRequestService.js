/**
 * Service for managing leave requests
 */

const LEAVE_REQUEST_TABLE = 'leave_request1';

/**
 * Get all leave request fields
 * @returns {Array} Array of field names
 */
const getLeaveRequestFields = () => {
  return [
    'Name',
    'Tags',
    'Owner',
    'CreatedOn',
    'CreatedBy',
    'ModifiedOn',
    'ModifiedBy',
    'leaveType',
    'startDate',
    'endDate',
    'days',
    'reason',
    'status',
    'employee'
  ];
};

/**
 * Get only updateable leave request fields
 * @returns {Array} Array of updateable field names
 */
const getUpdateableFields = () => {
  return [
    'Name',
    'Tags',
    'Owner',
    'leaveType',
    'startDate',
    'endDate',
    'days',
    'reason',
    'status',
    'employee'
  ];
};

/**
 * Fetch leave requests
 * @param {Object} filters Optional filters to apply
 * @returns {Promise} Promise resolving to leave request data
 */
export const fetchLeaveRequests = async (filters = {}) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: getLeaveRequestFields(),
    };

    const whereConditions = [];

    // Filter by employee if provided
    if (filters.employeeId) {
      whereConditions.push({
        fieldName: 'employee',
        operator: 'ExactMatch',
        values: [filters.employeeId]
      });
    }

    // Filter by status if provided
    if (filters.status) {
      whereConditions.push({
        fieldName: 'status',
        operator: 'ExactMatch',
        values: [filters.status]
      });
    }

    // Filter by date range if provided
    if (filters.startDate && filters.endDate) {
      whereConditions.push({
        fieldName: 'startDate',
        operator: 'GreaterThanOrEqualTo',
        values: [filters.startDate]
      });
      
      whereConditions.push({
        fieldName: 'endDate',
        operator: 'LessThanOrEqualTo',
        values: [filters.endDate]
      });
    }

    if (whereConditions.length > 0) {
      params.where = whereConditions;
    }

    const response = await apperClient.fetchRecords(LEAVE_REQUEST_TABLE, params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    throw error;
  }
};

/**
 * Create a new leave request
 * @param {Object} requestData Leave request data
 * @returns {Promise} Promise resolving to created leave request
 */
export const createLeaveRequest = async (requestData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Filter out non-updateable fields
    const updateableFields = getUpdateableFields();
    const filteredData = Object.keys(requestData)
      .filter(key => updateableFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = requestData[key];
        return obj;
      }, {});

    // Generate a Name if not provided
    if (!filteredData.Name && filteredData.employee && filteredData.leaveType) {
      filteredData.Name = `Leave-${filteredData.leaveType}-${Date.now()}`;
    }

    // Ensure days is a number
    if (filteredData.days && typeof filteredData.days !== 'number') {
      filteredData.days = parseInt(filteredData.days) || 0;
    }

    const params = {
      records: [filteredData]
    };

    const response = await apperClient.createRecord(LEAVE_REQUEST_TABLE, params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error('Failed to create leave request');
  } catch (error) {
    console.error('Error creating leave request:', error);
    throw error;
  }
};

/**
 * Update a leave request
 * @param {string} requestId Leave request ID
 * @param {Object} requestData Updated leave request data
 * @returns {Promise} Promise resolving to updated leave request
 */
export const updateLeaveRequest = async (requestId, requestData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Filter out non-updateable fields
    const updateableFields = getUpdateableFields();
    const filteredData = Object.keys(requestData)
      .filter(key => updateableFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = requestData[key];
        return obj;
      }, {});

    // Add ID for update
    filteredData.Id = requestId;

    const params = {
      records: [filteredData]
    };

    const response = await apperClient.updateRecord(LEAVE_REQUEST_TABLE, params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error('Failed to update leave request');
  } catch (error) {
    console.error('Error updating leave request:', error);
    throw error;
  }
};