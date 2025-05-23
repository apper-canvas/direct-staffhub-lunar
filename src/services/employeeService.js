/**
 * Service for managing employee data
 */

const EMPLOYEE_TABLE = 'employee2';

/**
 * Get all employee fields
 * @returns {Array} Array of field names
 */
const getEmployeeFields = () => {
  return [
    'Name',
    'Tags',
    'Owner',
    'CreatedOn',
    'CreatedBy',
    'ModifiedOn',
    'ModifiedBy',
    'firstName',
    'lastName',
    'email',
    'department',
    'position',
    'status',
    'hireDate',
    'avatar',
    'phone',
  ];
};

/**
 * Get only updateable employee fields
 * @returns {Array} Array of updateable field names
 */
const getUpdateableFields = () => {
  return [
    'Name',
    'Tags',
    'Owner',
    'firstName',
    'lastName',
    'email',
    'department',
    'position',
    'status',
    'hireDate',
    'avatar',
    'phone',
  ];
};

/**
 * Fetch all employees
 * @param {Object} filters Optional filters to apply
 * @returns {Promise} Promise resolving to employee data
 */
export const fetchEmployees = async (filters = {}) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: getEmployeeFields(),
    };

    // Add filters if they exist
    if (filters.department && filters.department !== 'all') {
      params.where = [
        {
          fieldName: 'department',
          operator: 'ExactMatch',
          values: [filters.department]
        }
      ];
    }

    if (filters.searchTerm) {
      const searchConditions = [
        {
          fieldName: 'firstName',
          operator: 'Contains',
          values: [filters.searchTerm]
        },
        {
          fieldName: 'lastName',
          operator: 'Contains',
          values: [filters.searchTerm]
        },
        {
          fieldName: 'email',
          operator: 'Contains',
          values: [filters.searchTerm]
        }
      ];
      
      params.whereGroups = [
        {
          operator: 'OR',
          subGroups: [
            { conditions: searchConditions[0], operator: '' },
            { conditions: searchConditions[1], operator: '' },
            { conditions: searchConditions[2], operator: '' }
          ]
        }
      ];
    }

    const response = await apperClient.fetchRecords(EMPLOYEE_TABLE, params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

/**
 * Create a new employee
 * @param {Object} employeeData Employee data
 * @returns {Promise} Promise resolving to created employee
 */
export const createEmployee = async (employeeData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Filter out non-updateable fields
    const updateableFields = getUpdateableFields();
    const filteredData = Object.keys(employeeData)
      .filter(key => updateableFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = employeeData[key];
        return obj;
      }, {});

    // Generate Name field from firstName and lastName
    if (employeeData.firstName && employeeData.lastName) {
      filteredData.Name = `${employeeData.firstName} ${employeeData.lastName}`;
    }

    const params = {
      records: [filteredData]
    };

    const response = await apperClient.createRecord(EMPLOYEE_TABLE, params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error('Failed to create employee');
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

/**
 * Update an employee
 * @param {string} employeeId Employee ID
 * @param {Object} employeeData Updated employee data
 * @returns {Promise} Promise resolving to updated employee
 */
export const updateEmployee = async (employeeId, employeeData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Filter out non-updateable fields
    const updateableFields = getUpdateableFields();
    const filteredData = Object.keys(employeeData)
      .filter(key => updateableFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = employeeData[key];
        return obj;
      }, {});

    // Generate Name field from firstName and lastName
    if (employeeData.firstName && employeeData.lastName) {
      filteredData.Name = `${employeeData.firstName} ${employeeData.lastName}`;
    }

    // Add ID for update
    filteredData.Id = employeeId;

    const params = {
      records: [filteredData]
    };

    const response = await apperClient.updateRecord(EMPLOYEE_TABLE, params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error('Failed to update employee');
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

/**
 * Delete an employee
 * @param {string} employeeId Employee ID
 * @returns {Promise} Promise resolving to delete result
 */
export const deleteEmployee = async (employeeId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [employeeId]
    };

    const response = await apperClient.deleteRecord(EMPLOYEE_TABLE, params);
    
    if (response && response.success) {
      return true;
    }
    
    throw new Error('Failed to delete employee');
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};