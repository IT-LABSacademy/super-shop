import axios from "axios";

const http = axios.create()

http.defaults.baseURL = 'https://to-do-66a0e-default-rtdb.asia-southeast1.firebasedatabase.app'

export default http