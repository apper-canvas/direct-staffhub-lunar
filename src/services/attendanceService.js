/**
 * Service for managing attendance records
 */

const ATTENDANCE_TABLE = 'attendance_record';

/**
 * Get all attendance record fields
 * @returns {Array} Array of field names
 */
const getAttendanceFields = () => {
  return [
    'Name',
    'Tags',
    'Owner',
    'CreatedOn',
    'CreatedBy',
    'ModifiedOn',
    'ModifiedBy',
    'date',
    'clockIn',
    'clockOut',
    'breakTime',
    'totalHours',
    'status',
    'employee'
  ];
};

/**
 * Get only updateable attendance fields
 * @returns {Array} Array of updateable field names
 */
const getUpdateableFields = () => {
  return [
    'Name',
    'Tags',
    'Owner',
    'date',
    'clockIn',
    'clockOut',
    'breakTime',
    'totalHours',
    'status',
    'employee'
  ];
};

/**
 * Fetch attendance records
 * @param {Object} filters Optional filters to apply
 * @returns {Promise} Promise resolving to attendance data
 */
export const fetchAttendanceRecords = async (filters = {}) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: getAttendanceFields(),
    };

    const whereConditions = [];

    // Filter by date if provided
    if (filters.date) {
      whereConditions.push({
        fieldName: 'date',
        operator: 'ExactMatch',
        values: [filters.date]
      });
    }

    // Filter by employee if provided
    if (filters.employeeId && filters.employeeId !== 'all') {
      whereConditions.push({
        fieldName: 'employee',
        operator: 'ExactMatch',
        values: [filters.employeeId]
      });
    }

    // Filter by status if provided
    if (filters.status && filters.status !== 'all') {
      whereConditions.push({
        fieldName: 'status',
        operator: 'ExactMatch',
        values: [filters.status]
      });
    }

    if (whereConditions.length > 0) {
      params.where = whereConditions;
    }

    const response = await apperClient.fetchRecords(ATTENDANCE_TABLE, params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    throw error;
  }
};

/**
 * Create a new attendance record
 * @param {Object} recordData Attendance record data
 * @returns {Promise} Promise resolving to created attendance record
 */
export const createAttendanceRecord = async (recordData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Filter out non-updateable fields
    const updateableFields = getUpdateableFields();
    const filteredData = Object.keys(recordData)
      .filter(key => updateableFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = recordData[key];
        return obj;
      }, {});

    // Generate a Name if not provided
    if (!filteredData.Name && filteredData.employee && filteredData.date) {
      filteredData.Name = `Attendance-${filteredData.employee}-${filteredData.date}`;
    }

    const params = {
      records: [filteredData]
    };

    const response = await apperClient.createRecord(ATTENDANCE_TABLE, params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error('Failed to create attendance record');
  } catch (error) {
    console.error('Error creating attendance record:', error);
    throw error;
  }
};

/**
 * Update an attendance record
 * @param {string} recordId Attendance record ID
 * @param {Object} recordData Updated attendance record data
 * @returns {Promise} Promise resolving to updated attendance record
 */
export const updateAttendanceRecord = async (recordId, recordData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Filter out non-updateable fields
    const updateableFields = getUpdateableFields();
    const filteredData = Object.keys(recordData)
      .filter(key => updateableFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = recordData[key];
        return obj;
      }, {});

    // Add ID for update
    filteredData.Id = recordId;

    const params = {
      records: [filteredData]
    };

    const response = await apperClient.updateRecord(ATTENDANCE_TABLE, params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error('Failed to update attendance record');
  } catch (error) {
    console.error('Error updating attendance record:', error);
    throw error;
  }
};

/**
 * Check if an employee already has an attendance record for a specific date
 * @param {string} employeeId Employee ID
 * @param {string} date Date in YYYY-MM-DD format
 * @returns {Promise} Promise resolving to attendance record or null
 */
export const getAttendanceByEmployeeAndDate = async (employeeId, date) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: getAttendanceFields(),
      where: [
        {
          fieldName: 'employee',
          operator: 'ExactMatch',
          values: [employeeId]
        },
        {
          fieldName: 'date',
          operator: 'ExactMatch',
          values: [date]
        }
      ]
    };

    const response = await apperClient.fetchRecords(ATTENDANCE_TABLE, params);
    
    if (response && response.data && response.data.length > 0) {
      return response.data[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error checking attendance record:', error);
    throw error;
  }
};