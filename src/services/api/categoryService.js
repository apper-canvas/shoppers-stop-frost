import { getApperClient } from "@/services/apperClient";

class CategoryService {
  constructor() {
    this.tableName = "category_c";
  }

  parseArrayField(value) {
    if (!value) return [];
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }

  formatArrayField(array) {
    return JSON.stringify(array || []);
  }

  transformFromDB(record) {
    return {
      Id: record.Id,
      name: record.name_c || "",
      display: record.display_c || "",
      subcategories: this.parseArrayField(record.subcategories_c)
    };
  }

  transformToDB(category) {
    return {
      name_c: category.name,
      display_c: category.display,
      subcategories_c: this.formatArrayField(category.subcategories)
    };
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "display_c" } },
          { field: { Name: "subcategories_c" } }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(record => this.transformFromDB(record)) || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "display_c" } },
          { field: { Name: "subcategories_c" } }
        ]
      });

      if (!response.success || !response.data) {
        return null;
      }

      return this.transformFromDB(response.data);
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      return null;
    }
  }

  async getByName(name) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "display_c" } },
          { field: { Name: "subcategories_c" } }
        ],
        where: [{
          FieldName: "name_c",
          Operator: "EqualTo",
          Values: [name]
        }],
        pagingInfo: { limit: 1, offset: 0 }
      });

      if (!response.success || !response.data || response.data.length === 0) {
        return null;
      }

      return this.transformFromDB(response.data[0]);
    } catch (error) {
      console.error(`Error fetching category by name ${name}:`, error);
      return null;
    }
  }

  async create(category) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const data = this.transformToDB(category);
      
      const response = await apperClient.createRecord(this.tableName, {
        records: [data]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create category:`, failed);
          throw new Error(failed[0].message || "Failed to create category");
        }
        
        if (successful.length > 0) {
          return this.transformFromDB(successful[0].data);
        }
      }

      throw new Error("Unknown error creating category");
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  async update(id, categoryData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const data = this.transformToDB(categoryData);
      data.Id = parseInt(id);

      const response = await apperClient.updateRecord(this.tableName, {
        records: [data]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update category:`, failed);
          throw new Error(failed[0].message || "Failed to update category");
        }
        
        if (successful.length > 0) {
          return this.transformFromDB(successful[0].data);
        }
      }

      throw new Error("Unknown error updating category");
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.deleteRecord(this.tableName, {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting category:", error);
      return false;
    }
  }
}

export default new CategoryService();