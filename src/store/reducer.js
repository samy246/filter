export const initialState = {
  cart: [],
  summary: [],
  productcount: null,
  currentorderid: null,
  selected: [],
  vat: [],
  cstatus: false,
  splitorder: false,
  user: null,
  manumodal: "",
  ratingmodal: false,
  orderDropDownList: false,
  remainingOrderData: [],
  historybillMonths: [],
  notification: false,
  minimenu: false,
  miniCart: false,
  megamenu: false,
  megamenu_hide: false,
  wishlist: null,
  favdata: [],
  favtg: false,
  wishlistData: [],
  spinner: "",
  roles: [],
  ordercollections: false,
  review: false,
  gt: true,
  thumbs: false,
  language: 1,
  brands: [],
  selection: [],
  cal: false,
  invdata: "",
  scroll: false,
  searchbar: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };

    case "UPDATE_CART":
      return {
        ...state,
        cart: action.data,
      };

    case "SUMMARY_DATA":
      return {
        ...state,
        summary: action.data,
      };

    case "PRODUCT_COUNT":
      return {
        ...state,
        productcount: action.data,
      };

    case "CURRENT_ORDER":
      return {
        ...state,
        currentorderid: action.data,
      };

    case "SELECTED_DATA":
      return {
        ...state,
        selected: action.data,
      };

    case "VAT_DATA":
      return {
        ...state,
        vat: action.data,
      };

    case "ORDERS":
      return {
        ...state,
        ordercollections: !state.ordercollections,
      };

    case "CART_STATUS":
      return {
        ...state,
        cstatus: !state.cstatus,
      };

    case "SPLIT_ORDER":
      return {
        ...state,
        splitorder: !state.splitorder,
      };

    case "SET_MANU_MODAL":
      return {
        ...state,
        manumodal: action.modal,
      };

    case "SET_RATING_MODAL":
      return {
        ...state,
        ratingmodal: action.modal,
      };

    case "ORDER_DROPDOWN":
      return {
        ...state,
        orderDropDownList: action.value,
      };

    case "REMAINING_ORDER":
      return {
        ...state,
        remainingOrderData: action.remain,
      };

    case "HISTORY_MONTHS":
      return {
        ...state,
        historybillMonths: [...state.historybillMonths, action.item],
      };

    case "SET_MINIMENU":
      return {
        ...state,
        minimenu: action.value,
      };

    case "SET_NOTIFICATION":
      return {
        ...state,
        notification: action.value,
      };

    case "SET_MINICART":
      return {
        ...state,
        miniCart: action.value,
      };

    case "SET_MEGAMENU":
      return {
        ...state,
        megamenu: !state.megamenu,
      };

    case "SET_LANGUAGE":
      return {
        ...state,
        language: action.value,
      };

    case "WISHLIST_DATA":
      return {
        ...state,
        wishlistData: action.data,
      };

    case "TRIGGER_WISHLIST":
      return {
        ...state,
        wishlist: !state.wishlist,
      };

    case "USER_ROLES_ID":
      return {
        // ...state,
        roles: action.data,
      };

    case "REVIEW__SELECED":
      return {
        ...state,
        review: action.value,
      };

    case "GENERAL__TRIGGER":
      return {
        ...state,
        gt: !state.gt,
      };

    case "THUMBS__TRIGGER":
      return {
        ...state,
        thumbs: !state.thumbs,
      };
    case "SET_MEGAMENU_HIDE":
      return {
        ...state,
        megamenu_hide: action.value,
      };
    case "BRANDS_DATA":
      return {
        ...state,
        brands: action.brands,
      };
    case "SET_ORDERSTATUS":
      return {
        ...state,
        selection: action.value,
      };
    case "CAL__CLOSE":
      return {
        ...state,
        cal: action.cal,
      };
    case "INV__BILL":
      return {
        ...state,
        invdata: action.data,
      };

    case "SCROLL__TOP":
      return {
        ...state,
        scroll: !state.scroll,
      };

    case "SEARCHBAR__CLOSEOPEN":
      return {
        ...state,
        searchbar: !state.searchbar,
      };

    default:
      return state;
  }
};

export default reducer;
