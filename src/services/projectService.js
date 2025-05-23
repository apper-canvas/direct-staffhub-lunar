/**
 * Service for managing project data
 */

const PROJECT_TABLE = 'project3';

/**
 * Get all project fields
 * @returns {Array} Array of field names
 */
const getProjectFields = () => {
  return [
    'Name',
    'Tags',
    'Owner',
    'CreatedOn',
    'CreatedBy',
    'ModifiedOn',
    'ModifiedBy',
    'description',
    'status',
    'priority',
    'startDate',
    'endDate',
    'progress',
    'budget'
  ];
};

/**
 * Get only updateable project fields
 * @returns {Array} Array of updateable field names
 */
const getUpdateableFields = () => {
  return [
    'Name',
    'Tags',
    'Owner',
    'description',
    'status',
    'priority',
    'startDate',
    'endDate',
    'progress',
    'budget'
  ];
};

/**
 * Fetch all projects
 * @param {Object} filters Optional filters to apply
 * @returns {Promise} Promise resolving to project data
 */
export const fetchProjects = async (filters = {}) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: getProjectFields(),
    };

    // Add filters if they exist
    if (filters.status) {
      params.where = [
        {
          fieldName: 'status',
          operator: 'ExactMatch',
          values: [filters.status]
        }
      ];
    }

    if (filters.priority) {
      const priorityCondition = {
        fieldName: 'priority',
        operator: 'ExactMatch',
        values: [filters.priority]
      };

      if (params.where) {
        params.where.push(priorityCondition);
      } else {
        params.where = [priorityCondition];
      }
    }

    const response = await apperClient.fetchRecords(PROJECT_TABLE, params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

/**
 * Create a new project
 * @param {Object} projectData Project data
 * @returns {Promise} Promise resolving to created project
 */
export const createProject = async (projectData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Filter out non-updateable fields
    const updateableFields = getUpdateableFields();
    const filteredData = Object.keys(projectData)
      .filter(key => updateableFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = projectData[key];
        return obj;
      }, {});

    // Ensure budget is a number
    if (filteredData.budget && typeof filteredData.budget !== 'number') {
      filteredData.budget = parseFloat(filteredData.budget) || 0;
    }

    const params = {
      records: [filteredData]
    };

    const response = await apperClient.createRecord(PROJECT_TABLE, params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error('Failed to create project');
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

/**
 * Update a project
 * @param {string} projectId Project ID
 * @param {Object} projectData Updated project data
 * @returns {Promise} Promise resolving to updated project
 */
export const updateProject = async (projectId, projectData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Filter out non-updateable fields
    const updateableFields = getUpdateableFields();
    const filteredData = Object.keys(projectData)
      .filter(key => updateableFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = projectData[key];
        return obj;
      }, {});

    // Ensure budget is a number
    if (filteredData.budget && typeof filteredData.budget !== 'number') {
      filteredData.budget = parseFloat(filteredData.budget) || 0;
    }

    // Add ID for update
    filteredData.Id = projectId;

    const params = {
      records: [filteredData]
    };

    const response = await apperClient.updateRecord(PROJECT_TABLE, params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error('Failed to update project');
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

/**
 * Delete a project
 * @param {string} projectId Project ID
 * @returns {Promise} Promise resolving to delete result
 */
export const deleteProject = async (projectId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [projectId]
    };

    const response = await apperClient.deleteRecord(PROJECT_TABLE, params);
    
    if (response && response.success) {
      return true;
    }
    
    throw new Error('Failed to delete project');
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};