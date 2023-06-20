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
      <ProductCardSkeleton v-for="i in 8" v-if="!products.length" />
      <ProductCard v-else v-for="item in products" :key="item.id" :product="item.data" @delete="productToDelete = item.id"
        @edit="$router.push({ name: 'edit-product', params: { id: item.id } })" @cart="addToCart(item.id, item.data)" />
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

        <div class="cart-item p-3 mb-2 shadow" v-for="item in cartItems" :key="item.cart_id">
          {{ item.data.name }}
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

export default {
  components: { ProductCard, ProductCardSkeleton, Popup, CurtainPopup },
  data() {
    return {
      productToDelete: null,
      products: [],
      cartItems: [],
      toast: useToast(),
      showCart: false,
    }
  },
  methods: {
    async fetchProducts() {
      const res = await http.get('/products.json')
      const productList = [];

      Object.keys(res.data).forEach((key) => {
        productList.push({ id: key, data: res.data[key] });
      });
      this.products = productList
    },
    async deleteProduct(id) {
      if (!id) return
      await http.delete('/products/' + id + '.json')
      this.productToDelete = null
      this.toast.success('Product has been deleted!')
      this.fetchProducts()
    },
    async addToCart(id, product) {
      const item = this.cartItems.find(product => product.product_id === id)
      if (item) {
        this.toast.warning('Product already in the cart!')
        return
      }
      const res = await http.post('/cart.json', { id: id, data: product })
      this.toast.success(product.name + ' - added to cart!')
      this.fetchCartItems()
    },
    async fetchCartItems() {
      const res = await http.get('/cart.json')
      const items = []
      Object.keys(res.data).forEach((key) => {
        items.push(
          { cart_id: key, product_id: res.data[key].id, data: res.data[key].data }
        );
      });
      this.cartItems = items
    }
  },
  mounted() {
    this.fetchProducts()
    this.fetchCartItems()
  }
}
</script>
