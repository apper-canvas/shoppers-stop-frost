import { getApperClient } from "@/services/apperClient";
import React from "react";
import Error from "@/components/ui/Error";

class ReviewService {
  constructor() {
    this.tableName = "review_c";
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
      productId: record.product_id_c?.Id || record.product_id_c,
      userId: record.user_id_c?.Id || record.user_id_c,
      userName: record.user_name_c || "",
      rating: record.rating_c || 0,
      title: record.title_c || "",
      text: record.text_c || "",
      verifiedBuyer: record.verified_buyer_c === true,
      helpful: record.helpful_c || 0,
      notHelpful: record.not_helpful_c || 0,
      variant: record.variant_c || "",
      images: this.parseArrayField(record.images_c),
      createdAt: record.created_at_c || record.CreatedOn || new Date().toISOString()
    };
  }

  transformToDB(review) {
    const data = {
      user_name_c: review.userName,
      rating_c: parseInt(review.rating),
      title_c: review.title,
      text_c: review.text,
      verified_buyer_c: review.verifiedBuyer === true,
      helpful_c: parseInt(review.helpful || 0),
      not_helpful_c: parseInt(review.notHelpful || 0),
      variant_c: review.variant || "",
      images_c: this.formatArrayField(review.images),
      created_at_c: review.createdAt || new Date().toISOString()
    };

    if (review.productId) {
      data.product_id_c = parseInt(review.productId);
    }

    if (review.userId) {
      data.user_id_c = parseInt(review.userId);
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
          { field: { Name: "product_id_c" } },
          { field: { Name: "user_id_c" } },
          { field: { Name: "user_name_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "text_c" } },
          { field: { Name: "verified_buyer_c" } },
          { field: { Name: "helpful_c" } },
          { field: { Name: "not_helpful_c" } },
          { field: { Name: "variant_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "created_at_c" } }
        ],
        pagingInfo: { limit: 1000, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(record => this.transformFromDB(record)) || [];
    } catch (error) {
      console.error("Error fetching reviews:", error);
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
          { field: { Name: "product_id_c" } },
          { field: { Name: "user_id_c" } },
          { field: { Name: "user_name_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "text_c" } },
          { field: { Name: "verified_buyer_c" } },
          { field: { Name: "helpful_c" } },
          { field: { Name: "not_helpful_c" } },
          { field: { Name: "variant_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "created_at_c" } }
        ]
      });

      if (!response.success || !response.data) {
        return null;
      }

      return this.transformFromDB(response.data);
    } catch (error) {
      console.error(`Error fetching review ${id}:`, error);
return null;
    }
  }

  async getByProductId(productId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "product_id_c" } },
          { field: { Name: "user_id_c" } },
          { field: { Name: "user_name_c" } },
          { field: { Name: "rating_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "text_c" } },
          { field: { Name: "verified_buyer_c" } },
          { field: { Name: "helpful_c" } },
          { field: { Name: "not_helpful_c" } },
          { field: { Name: "variant_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "created_at_c" } }
        ],
        where: [{
          FieldName: "product_id_c",
          Operator: "EqualTo",
          Values: [parseInt(productId)]
        }],
        pagingInfo: { limit: 1000, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(record => this.transformFromDB(record)) || [];
    } catch (error) {
      console.error(`Error fetching reviews for product ${productId}:`, error);
return [];
    }
  }

  async create(review) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const reviewData = {
        ...review,
        helpful: 0,
        notHelpful: 0,
        createdAt: new Date().toISOString()
      };

      const data = this.transformToDB(reviewData);
      
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
          console.error(`Failed to create review:`, failed);
          throw new Error(failed[0].message || "Failed to create review");
        }
        
        if (successful.length > 0) {
          return this.transformFromDB(successful[0].data);
        }
      }

      throw new Error("Unknown error creating review");
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  }

async update(id, data) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const updateData = this.transformToDB(data);
      updateData.Id = parseInt(id);

      const response = await apperClient.updateRecord(this.tableName, {
        records: [updateData]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update review:`, failed);
          throw new Error(failed[0].message || "Failed to update review");
        }
        
        if (successful.length > 0) {
          return this.transformFromDB(successful[0].data);
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating review:", error);
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
      console.error("Error deleting review:", error);
      return false;
    }
  }

async markHelpful(id) {
    try {
      const review = await this.getById(id);
      if (review) {
        return await this.update(id, {
          helpful: (review.helpful || 0) + 1
        });
      }
      return null;
    } catch (error) {
      console.error("Error marking review helpful:", error);
      return null;
    }
  }

async markNotHelpful(id) {
    try {
      const review = await this.getById(id);
      if (review) {
        return await this.update(id, {
          notHelpful: (review.notHelpful || 0) + 1
        });
      }
      return null;
    } catch (error) {
      console.error("Error marking review not helpful:", error);
      return null;
    }
  }

async getStatsByProductId(productId) {
    try {
      const reviews = await this.getByProductId(productId);
      
      if (reviews.length === 0) {
        return {
          average: 0,
          total: 0,
          breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        };
      }

      const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      let sum = 0;

      reviews.forEach(review => {
        breakdown[review.rating]++;
        sum += review.rating;
      });

      return {
        average: Math.round((sum / reviews.length) * 10) / 10,
        total: reviews.length,
        breakdown
      };
    } catch (error) {
      console.error("Error getting review stats:", error);
      return {
        average: 0,
        total: 0,
        breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
}
  }
}

export default new ReviewService();