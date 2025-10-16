import React from "react"
import { Outlet } from "react-router-dom"
import Header from "@/components/organisms/Header"
import Navigation from "@/components/organisms/Navigation"

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-primary text-surface mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Shoppers Stop</h3>
              <p className="text-gray-300 text-sm">
                Your one-stop destination for fashion, beauty, and lifestyle products.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-surface transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-surface transition-colors">Size Guide</a></li>
                <li><a href="#" className="hover:text-surface transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-surface transition-colors">Returns</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-surface transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-surface transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-surface transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-surface transition-colors">Investors</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-surface transition-colors">Newsletter</a></li>
                <li><a href="#" className="hover:text-surface transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-surface transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-surface transition-colors">Twitter</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-300">
            <p>&copy; 2024 Shoppers Stop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout