import { getApperClient } from "@/services/apperClient";
import React from "react";
import Error from "@/components/ui/Error";

class ProductService {
  constructor() {
    this.tableName = "product_c";
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
      brand: record.brand_c || "",
      category: record.category_c || "",
      subcategory: record.subcategory_c || "",
      price: record.price_c || 0,
      salePrice: record.sale_price_c || null,
      images: this.parseArrayField(record.images_c),
      sizes: record.sizes_c ? record.sizes_c.split(',') : [],
      colors: record.colors_c ? record.colors_c.split(',') : [],
      description: record.description_c || "",
      inStock: record.in_stock_c !== false,
      rating: 0,
      reviewCount: 0
    };
  }

  transformToDB(product) {
    const data = {
      name_c: product.name,
      brand_c: product.brand,
      category_c: product.category,
      subcategory_c: product.subcategory || "",
      price_c: parseFloat(product.price),
      images_c: this.formatArrayField(product.images),
      sizes_c: Array.isArray(product.sizes) ? product.sizes.join(',') : "",
      colors_c: Array.isArray(product.colors) ? product.colors.join(',') : "",
      description_c: product.description || "",
      in_stock_c: product.inStock !== false
    };

    if (product.salePrice !== null && product.salePrice !== undefined) {
      data.sale_price_c = parseFloat(product.salePrice);
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
          { field: { Name: "name_c" } },
          { field: { Name: "brand_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "subcategory_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "sale_price_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "sizes_c" } },
          { field: { Name: "colors_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "in_stock_c" } }
        ],
        pagingInfo: { limit: 1000, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(record => this.transformFromDB(record)) || [];
    } catch (error) {
      console.error("Error fetching products:", error);
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
          { field: { Name: "brand_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "subcategory_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "sale_price_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "sizes_c" } },
          { field: { Name: "colors_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "in_stock_c" } }
        ]
      });

      if (!response.success || !response.data) {
        return null;
      }

      return this.transformFromDB(response.data);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
return null;
    }
  }

  async getByCategory(category) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "brand_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "subcategory_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "sale_price_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "sizes_c" } },
          { field: { Name: "colors_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "in_stock_c" } }
        ],
        where: [{
          FieldName: "category_c",
          Operator: "EqualTo",
          Values: [category]
        }],
        pagingInfo: { limit: 1000, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(record => this.transformFromDB(record)) || [];
    } catch (error) {
      console.error("Error fetching products by category:", error);
      return [];
    }
  }

async getOnSale() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "brand_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "subcategory_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "sale_price_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "sizes_c" } },
          { field: { Name: "colors_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "in_stock_c" } }
        ],
        where: [{
          FieldName: "sale_price_c",
          Operator: "HasValue",
          Values: []
        }],
        pagingInfo: { limit: 1000, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(record => this.transformFromDB(record)) || [];
    } catch (error) {
      console.error("Error fetching sale products:", error);
      return [];
    }
  }

async getFeatured(limit = 8) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "brand_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "subcategory_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "sale_price_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "sizes_c" } },
          { field: { Name: "colors_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "in_stock_c" } }
        ],
        pagingInfo: { limit: limit, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(record => this.transformFromDB(record)) || [];
    } catch (error) {
      console.error("Error fetching featured products:", error);
      return [];
    }
  }

async searchProducts(query) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "brand_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "subcategory_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "sale_price_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "sizes_c" } },
          { field: { Name: "colors_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "in_stock_c" } }
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [{
                fieldName: "name_c",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            },
            {
              conditions: [{
                fieldName: "brand_c",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            },
            {
              conditions: [{
                fieldName: "category_c",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            }
          ]
        }],
        pagingInfo: { limit: 1000, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(record => this.transformFromDB(record)) || [];
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  }

async filterProducts(filters) {
    const allProducts = await this.getAll();
    let filtered = [...allProducts];

    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter(p => filters.brands.includes(p.brand));
    }

    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      filtered = filtered.filter(p => {
        const price = p.salePrice || p.price;
        return price >= min && price <= max;
      });
    }

    if (filters.colors && filters.colors.length > 0) {
      filtered = filtered.filter(p => 
        p.colors.some(color => filters.colors.includes(color))
      );
    }

    if (filters.sizes && filters.sizes.length > 0) {
      filtered = filtered.filter(p => 
        p.sizes.some(size => filters.sizes.includes(size))
      );
    }
return filtered;
  }

  async create(product) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const data = this.transformToDB(product);
      
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
          console.error(`Failed to create product:`, failed);
          throw new Error(failed[0].message || "Failed to create product");
        }
        
        if (successful.length > 0) {
          return this.transformFromDB(successful[0].data);
        }
      }

      throw new Error("Unknown error creating product");
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

async update(id, productData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not initialized");

      const data = this.transformToDB(productData);
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
          console.error(`Failed to update product:`, failed);
          throw new Error(failed[0].message || "Failed to update product");
        }
        
        if (successful.length > 0) {
          return this.transformFromDB(successful[0].data);
        }
      }

      throw new Error("Unknown error updating product");
    } catch (error) {
      console.error("Error updating product:", error);
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
      console.error("Error deleting product:", error);
      return false;
}
  }
}

export default new ProductService();