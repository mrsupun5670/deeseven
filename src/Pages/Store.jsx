import React from 'react'
import CategoryView from './CategoryView'
import Header from '../Components/Header'
import ProductStore from '../Components/ProductStore'
import Footer from '../Components/Footer'
import BottomNavBar from '../Components/BottomNavBar'

function Store() {
  return (
    <>
        <Header />
        <ProductStore />
        <BottomNavBar />
        <Footer />
    </>
  )
}

export default Store