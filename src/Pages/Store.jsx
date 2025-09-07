import React from 'react'
import CategoryView from './CategoryView'
import Header from '../Components/Header'
import ProductStore from '../Components/ProductStore'
import Footer from '../Components/Footer'
import BottomNavBar from '../Components/BottomNavBar'
import { useLocation } from 'react-router'

function Store() {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('search') || '';   
  return (
    <>
        <Header />
        <ProductStore searchQuery={searchQuery} />
        <BottomNavBar />
        <Footer />
    </>
  )
}

export default Store