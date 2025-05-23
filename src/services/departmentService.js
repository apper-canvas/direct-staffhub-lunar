/**
 * Service for managing department data
 */

const DEPARTMENT_TABLE = 'department2';

/**
 * Get all department fields
 * @returns {Array} Array of field names
 */
const getDepartmentFields = () => {
  return [
    'Name',
    'Tags',
    'Owner',
    'CreatedOn',
    'CreatedBy',
    'ModifiedOn',
    'ModifiedBy',
    'description'
  ];
};

/**
 * Get only updateable department fields
 * @returns {Array} Array of updateable field names
 */
const getUpdateableFields = () => {
  return [
    'Name',
    'Tags',
    'Owner',
    'description'
  ];
};

/**
 * Fetch all departments
 * @returns {Promise} Promise resolving to department data
 */
export const fetchDepartments = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: getDepartmentFields(),
    };

    const response = await apperClient.fetchRecords(DEPARTMENT_TABLE, params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

/**
 * Create a new department
 * @param {Object} departmentData Department data
 * @returns {Promise} Promise resolving to created department
 */
export const createDepartment = async (departmentData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Filter out non-updateable fields
    const updateableFields = getUpdateableFields();
    const filteredData = Object.keys(departmentData)
      .filter(key => updateableFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = departmentData[key];
        return obj;
      }, {});

    const params = {
      records: [filteredData]
    };

    const response = await apperClient.createRecord(DEPARTMENT_TABLE, params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error('Failed to create department');
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
};