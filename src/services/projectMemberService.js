/**
 * Service for managing project member data
 */

const PROJECT_MEMBER_TABLE = 'project_member';

/**
 * Get all project member fields
 * @returns {Array} Array of field names
 */
const getProjectMemberFields = () => {
  return [
    'Name',
    'Tags',
    'Owner',
    'CreatedOn',
    'CreatedBy',
    'ModifiedOn',
    'ModifiedBy',
    'project',
    'employee'
  ];
};

/**
 * Get only updateable project member fields
 * @returns {Array} Array of updateable field names
 */
const getUpdateableFields = () => {
  return [
    'Name',
    'Tags',
    'Owner',
    'project',
    'employee'
  ];
};

/**
 * Fetch project members
 * @param {Object} filters Optional filters to apply
 * @returns {Promise} Promise resolving to project member data
 */
export const fetchProjectMembers = async (filters = {}) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: getProjectMemberFields(),
    };

    // Filter by project if provided
    if (filters.projectId) {
      params.where = [
        {
          fieldName: 'project',
          operator: 'ExactMatch',
          values: [filters.projectId]
        }
      ];
    }

    // Filter by employee if provided
    if (filters.employeeId) {
      const employeeCondition = {
        fieldName: 'employee',
        operator: 'ExactMatch',
        values: [filters.employeeId]
      };

      if (params.where) {
        params.where.push(employeeCondition);
      } else {
        params.where = [employeeCondition];
      }
    }

    const response = await apperClient.fetchRecords(PROJECT_MEMBER_TABLE, params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching project members:', error);
    throw error;
  }
};

/**
 * Create a new project member
 * @param {Object} memberData Project member data
 * @returns {Promise} Promise resolving to created project member
 */
export const createProjectMember = async (memberData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Filter out non-updateable fields
    const updateableFields = getUpdateableFields();
    const filteredData = Object.keys(memberData)
      .filter(key => updateableFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = memberData[key];
        return obj;
      }, {});

    // Generate a Name if not provided
    if (!filteredData.Name && filteredData.project && filteredData.employee) {
      filteredData.Name = `Member-${Date.now()}`;
    }

    const params = {
      records: [filteredData]
    };

    const response = await apperClient.createRecord(PROJECT_MEMBER_TABLE, params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error('Failed to create project member');
  } catch (error) {
    console.error('Error creating project member:', error);
    throw error;
  }
};

/**
 * Delete a project member
 * @param {string} memberId Project member ID
 * @returns {Promise} Promise resolving to delete result
 */
export const deleteProjectMember = async (memberId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [memberId]
    };

    const response = await apperClient.deleteRecord(PROJECT_MEMBER_TABLE, params);
    
    if (response && response.success) {
      return true;
    }
    
    throw new Error('Failed to delete project member');
  } catch (error) {
    console.error('Error deleting project member:', error);
    throw error;
  }
};

/**
 * Add multiple employees to a project
 * @param {string} projectId Project ID
 * @param {Array} employeeIds Array of employee IDs to add
 * @returns {Promise} Promise resolving to created project members
 */
export const addEmployeesToProject = async (projectId, employeeIds) => {
  try {
    const records = employeeIds.map(employeeId => ({
      Name: `Project-${projectId}-Employee-${employeeId}`,
      project: projectId,
      employee: employeeId
    }));
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: records
    };

    const response = await apperClient.createRecord(PROJECT_MEMBER_TABLE, params);
    
    if (response && response.success && response.results) {
      return response.results
        .filter(result => result.success)
        .map(result => result.data);
    }
    
    throw new Error('Failed to add employees to project');
  } catch (error) {
    console.error('Error adding employees to project:', error);
    throw error;
  }
};