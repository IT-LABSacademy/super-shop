<template>
  <main class="container py-[50px]">
    <div class="head flex justify-between items-center">
      <h2 class="text-3xl text-gray-700 ">SuperMarket</h2>

      <div class="">
        <button class="btn py-2 mr-2 px-7 bg-yellow-600 text-white rounded hover:opacity-80" @click="showCart = true">
          <i class="fas fa-cart-shopping mr-2"></i>
          <span>Go to Cart</span>
        </button>
        <button class="btn py-2 px-7 bg-blue-600 text-white rounded hover:opacity-80"
          @click="$router.push({ name: 'create-product' })">
          <i class="fas fa-plus mr-2"></i>
          <span>Add new</span>
        </button>
      </div>
    </div>

    <div class="wrapper flex justify-center gap-4 flex-wrap mt-5">
      <ProductCardSkeleton v-for="i in 8" v-if="!productStore.getProductList.length" />
      <ProductCard v-else v-for="item in productStore.getProductList" :key="item.id" :product="item.data"
        @delete="productToDelete = item.id" @edit="$router.push({ name: 'edit-product', params: { id: item.id } })"
        @cart="addToCart(item.id, item.data)" />
    </div>

    <!-- modal -->
    <Popup :show="productToDelete">
      <div class="">
        <h3 class="text-2xl font-semibold text-center pb-5">Are you sure?</h3>
      </div>
      <div class="actions flex gap-2">
        <button class="btn py-2 text-sm bg-gray-600 w-1/2 text-white rounded"
          @click="productToDelete = null">Cancel</button>
        <button class="btn py-2 text-sm bg-red-600 w-1/2 text-white rounded" @click="deleteProduct(productToDelete)">
          Delete
        </button>
      </div>
    </Popup>

    <!-- cart -->
    <CurtainPopup :show="showCart" @close="showCart = false">
      <div class="wrapper p-5">
        <h2 class="text-2xl font-semibold mb-5">Cart</h2>

        <div class="cart-item p-3 mb-2 shadow rounded flex justify-between items-center"
          v-for="item in cartStore.getCartItems" :key="item.cart_id">
          <p class="">{{ item.data.name }}</p>

          <button class="btn text-red-500" @click="deleteFromCart(item.cart_id, item.data.name)">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </CurtainPopup>
  </main>
</template>

<script>
import ProductCard from '../components/ProductCard.vue';
import ProductCardSkeleton from '../components/ProductCard.skeleton.vue';
import http from '../axios.config'
import { useToast } from "vue-toastification";
import Popup from '../components/Popup.vue';
import CurtainPopup from '../components/CurtainPopup.vue';

import { useProductStore } from '../store/products'
import { useCartStore } from '../store/cart'

export default {
  components: { ProductCard, ProductCardSkeleton, Popup, CurtainPopup },
  data() {
    return {
      productStore: useProductStore(),
      cartStore: useCartStore(),
      productToDelete: null,
      toast: useToast(),
      showCart: false,
    }
  },
  methods: {
    async deleteProduct(id) {
      if (!id) return
      await this.productStore.deleteProduct(id)
      this.productToDelete = null
      this.toast.success('Product has been deleted!')
      this.productStore.fetchProducts()
    },
    async addToCart(id, product) {
      const item = this.cartStore.getCartItems.find(product => product.product_id === id)
      if (item) {
        this.toast.warning('Product already in the cart!')
        return
      }
      await this.cartStore.addToCart(id, product)
      this.toast.success(product.name + ' - added to cart!')
      this.cartStore.fetchCartItems()
    },
    async deleteFromCart(id, productName) {
      const name = productName
      await this.cartStore.deleteFromCart(id)
      this.toast.success(name + ' - removed from cart!')
      this.showCart = false
      await this.cartStore.fetchCartItems()
    }
  },
  mounted() {
    this.productStore.fetchProducts()
    this.cartStore.fetchCartItems()
  }
}
</script>
