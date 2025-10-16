import { getApperClient } from "@/services/apperClient";

class AddressService {
  constructor() {
    this.tableName = "address_c";
  }

  transformFromDB(record) {
    return {
      Id: record.Id,
      userId: record.user_id_c?.Id || record.user_id_c,
      name: record.name_c || "",
      mobile: record.mobile_c || "",
      pincode: record.pincode_c || "",
      address: record.address_c || "",
      city: record.city_c || "",
      state: record.state_c || "",
      isDefault: record.is_default_c === true
    };
  }

  transformToDB(address) {
    const data = {
      name_c: address.name,
      mobile_c: address.mobile,
      pincode_c: address.pincode,
      address_c: address.address,
      city_c: address.city,
      state_c: address.state
    };

    if (address.isDefault !== undefined) {
      data.is_default_c = address.isDefault;
    }

return data;
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "user_id_c" } },
          { field: { Name: "name_c" } },
          { field: { Name: "mobile_c" } },
          { field: { Name: "pincode_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "city_c" } },
          { field: { Name: "state_c" } },
          { field: { Name: "is_default_c" } }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(record => this.transformFromDB(record)) || [];
    } catch (error) {
      console.error("Error fetching addresses:", error);
      return [];
    }
}

  async getById(id) {
    try {
      if (!Number.isInteger(id)) {
        throw new Error("Address ID must be an integer");
      }

      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.getRecordById(this.tableName, id, {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "user_id_c" } },
          { field: { Name: "name_c" } },
          { field: { Name: "mobile_c" } },
          { field: { Name: "pincode_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "city_c" } },
          { field: { Name: "state_c" } },
          { field: { Name: "is_default_c" } }
        ]
      });

      if (!response.success || !response.data) {
        throw new Error("Address not found");
      }

      return this.transformFromDB(response.data);
    } catch (error) {
      console.error(`Error fetching address ${id}:`, error);
      throw error;
    }
}

  async create(addressData) {
    try {
      const requiredFields = ["name", "mobile", "pincode", "address", "city", "state"];
      const missingFields = requiredFields.filter(field => !addressData[field]?.trim());

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      if (addressData.mobile.length !== 10 || !/^\d+$/.test(addressData.mobile)) {
        throw new Error("Mobile number must be 10 digits");
      }

      if (addressData.pincode.length !== 6 || !/^\d+$/.test(addressData.pincode)) {
        throw new Error("Pincode must be 6 digits");
      }

      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const data = this.transformToDB(addressData);
      
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
          console.error(`Failed to create address:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return this.transformFromDB(successful[0].data);
        }
      }

      throw new Error("Unknown error creating address");
    } catch (error) {
      console.error("Error creating address:", error);
      throw error;
    }
}

  async update(id, addressData) {
    try {
      if (!Number.isInteger(id)) {
        throw new Error("Address ID must be an integer");
      }

      if (addressData.mobile && (addressData.mobile.length !== 10 || !/^\d+$/.test(addressData.mobile))) {
        throw new Error("Mobile number must be 10 digits");
      }

      if (addressData.pincode && (addressData.pincode.length !== 6 || !/^\d+$/.test(addressData.pincode))) {
        throw new Error("Pincode must be 6 digits");
      }

      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const data = this.transformToDB(addressData);
      data.Id = id;

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
          console.error(`Failed to update address:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return this.transformFromDB(successful[0].data);
        }
      }

      throw new Error("Unknown error updating address");
    } catch (error) {
      console.error("Error updating address:", error);
      throw error;
    }
}

  async delete(id) {
    try {
      if (!Number.isInteger(id)) {
        throw new Error("Address ID must be an integer");
      }

      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.deleteRecord(this.tableName, {
        RecordIds: [id]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete address:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting address:", error);
      throw error;
    }
}
}

const addressService = new AddressService();
export default addressService;