import React, { useState, useEffect } from "react";
import "./Wishlist.scss";
import cartIcon from "../../../assets/images/cart.svg";
import WishListPopUp from "../../WishlistComponents/WishListPopUp/WishListPopUp";
import axios from "axios";
import instance from "../../../request";
import { useStateValue } from "../../../store/state";
import { useHistory } from "react-router";
import { Modal } from "react-responsive-modal";
import request from "../../../request";
import { toast } from "react-toastify";

function Wishlist({ token }) {
  const [wishlistData, setWishListData] = useState([]);
  const history = useHistory();
  const [{ wishlist, gt }, dispatch] = useStateValue();
  const [cartstatus, setcartstatus] = useState();
  const [sortedfield, setsortfield] = useState(null);
  const [sortOrder, setSortOrder] = useState({ name: "asc", price: "" });
  const [sortField, setSortField] = useState("name");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (token === null || "" || undefined) {
      history.push("/login");
    }
  });
  const onOpenModal = (value) => {
    setcurrentvalue(value);
    setOpen(true);
  };
  const onCloseModal = () => setOpen(false);
  const [currentvalue, setcurrentvalue] = useState();

  useEffect(() => {}, [sortedfield]);

  // Deleting product from wishlist
  const deletecartitem = async () => {
    const cid = localStorage.getItem("userid");
    try {
      await axios({
        method: "post",
        url: instance.deletewishlist,
        data: {
          customerId: parseInt(cid),
          productId: parseInt(currentvalue),
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      onCloseModal();
      getWishlist();
      dispatch({
        type: "GENERAL__TRIGGER",
      });
    } catch (e) {
      console.log(e)
      // toast.error(e.response.data.message);
    }
  };
  // Get wishlist data
  const getWishlist = async () => {
    if (
      localStorage.getItem("userid") === null ||
      localStorage.getItem("token") === null
    )
      return;
    const userid = localStorage.getItem("userid");
    const token = localStorage.getItem("token");
    try {
      const wishData = await axios({
        method: "get",
        url: `${request.getwishlist}?customerId=${userid}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWishListData(wishData.data);
      dispatch({
        type: "WISHLIST_DATA",
        data: wishData.data,
      });
    } catch (e) {
      console.log(e)
      // toast.error(e.response.data.message);
    }
  };

  useEffect(() => {
    getWishlist();
  }, [wishlist, gt]);

  // Add product to cart
  const addtocart = async (qty, sku, price, specialprice, unit) => {
    const currentdata = wishlistData.find((data) => data.product.sku === sku);

    if (
      currentdata?.product?.order_taking === "N" &&
      currentdata?.product?.quantity_and_stock_status?.is_in_stock == false
    ) {
      return toast.info(`${currentdata?.product?.name} is Out of Stock`);
    }
    if (
      (currentdata?.product?.order_taking === "N" &&
        currentdata?.product?.quantity_and_stock_status?.is_in_stock === true &&
        parseInt(currentdata?.product?.quantity_and_stock_status?.qty) >= 1) ||
      currentdata?.product?.order_taking === "Y"
    ) {
      try {
        const cartdata = await axios({
          method: "post",
          url: request.cartadd,
          data: {
            cartItem: {
              sku: sku,
              quote_id: localStorage.getItem("cartid"),
              qty: qty,
              price: specialprice ? specialprice : price,
              extension_attributes: {
                unit: unit,
              },
            },
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setcartstatus(cartdata.status);
        toast.success(
          `${currentdata?.product.name} added to the cart Successfully`
        );
      } catch (e) {
        console.log(e)
        // toast.error(e.response.data.message);
      }
    } else {
      return toast.info(`${currentdata?.product?.name} is Out of Stock`);
    }
  };

  // trigger to call the cart list api
  useEffect(() => {
    dispatch({
      type: "CART_STATUS",
      status: cartstatus,
    });
  }, [cartstatus]);

  const onSort = (details) => {
    details?.sort((a, b) => {
      let x;
      let y;

      if (sortField === "price") {
        x = parseInt(a.product[sortField]);
        y = parseInt(b.product[sortField]);
      } else {
        x = a.product[sortField];
        y = b.product[sortField];
      }
      if (sortOrder[sortField] === "asc") return x < y ? -1 : x > y ? 1 : 0;
      else return x > y ? -1 : x < y ? 1 : 0;
    });
    return details;
  };
  const OnSortOrder = (sField) => {
    if (sortOrder[sField] === "asc")
      setSortOrder((prev) => ({ ...prev, [sField]: "desc" }));
    else setSortOrder((prev) => ({ ...prev, [sField]: "asc" }));
    setSortField(sField);
  };
  return (
    <div className="wishlist">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">
              <span
                className="wishlist__table__heading"
                onClick={() => OnSortOrder("name")}
              >
                Item &nbsp;
                <span>
                  <i className="fas fa-sort" />
                </span>
              </span>
            </th>
            <th scope="col">
              <span
                className="wishlist__table__heading"
                onClick={() => OnSortOrder("price")}
              >
                Price &nbsp;
                <span>
                  <i className="fas fa-sort" />
                </span>
              </span>
            </th>
            <th scope="col" className="wishlist__rightalign">
              <span
                className="wishlist__table__heading"
                onClick={() => setsortfield("Vendor")}
              >
                Vendor
              </span>
            </th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {onSort(wishlistData)?.map((data, i) => (
            <tr key={i}>
              <td col-span="2">
                <div className="wishlist__img">
                  <img
                    src={`${request.image}/media/catalog/product${data.product.image}`}
                    alt=""
                  />
                  <small>{data.product.name}</small>
                </div>
              </td>
              <td>฿&nbsp;{parseInt(data.product.price).toFixed(2)}</td>
              <td className="wishlist__rightalign">Passion Premium</td>
              <td className="wishlist__buttons__container">
                <div className="wishlist__buttons">
                  <span className="span__flex">
                    <p
                      className="wishlist__cart"
                      onClick={() =>
                        addtocart(
                          data.qty,
                          data.product.sku,
                          data.product.price,
                          data.product.specialprice,
                          data.product.unit
                        )
                      }
                    >
                      <img src={cartIcon} alt="" />
                      <p className="addtocart">Add to Cart</p>
                    </p>
                    <p
                      className="wishlist__delete"
                      onClick={() => onOpenModal(data.product_id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="20"
                        fill="currentColor"
                        className="bi bi-trash"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                        <path
                          fillRule="evenodd"
                          d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                        />
                      </svg>
                      <p>Delete</p>
                    </p>
                  </span>

                  <Modal
                    open={open}
                    onClose={onCloseModal}
                    className="text-center p-4"
                    dialogClassName="modal-90w"
                    aria-labelledby="contained-modal-title-vcenter"
                  >
                    <div className="wishlistpopup__body">
                      <div className=" pb-2">
                        <i className="far fa-trash-alt fa-3x wishlistpopup__body__icon " />
                      </div>
                      <h6 className="pb-2">Remove this item from Wishlist?</h6>
                      <div className="wishlistpopup__button d-grid gap-4 mx-auto">
                        <button
                          type="button"
                          className="btn btn-danger remove__button"
                          onClick={deletecartitem}
                        >
                          Remove
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary Cancle_button"
                          onClick={onCloseModal}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </Modal>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Wishlist;
