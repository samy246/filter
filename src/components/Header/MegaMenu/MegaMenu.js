import React, { useEffect, useState } from "react";
import "./MegaMenu.scss";
import request from "../../../request";
import axios from "axios";
import { useStateValue } from "../../../store/state";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
function MegaMenu({ menu }) {
  const [megamenu, setMegaMenu] = useState(false);
  const [{ brands }, dispatch] = useStateValue();
  const [CatalogCategoryies, setCatalogCategoryies] = useState([]);
  const [Activemenu, setActivemenu] = useState(null);
  useEffect(() => {
    getMenu();
  }, []);

  const closeSideMenu = () => {
    dispatch({
      type: "SET_MINIMENU",
      value: false,
    });
    dispatch({
      type: "SET_MEGAMENU_HIDE",
      value: false,
    });
  };
  const getMenu = async () => {
    try {
      const categoryies = await axios({
        method: "get",
        url: request.categorylist,
      });
      setCatalogCategoryies(categoryies.data.children_data);
    } catch (e) {
      console.log(e)
      // toast.error(e.response?.data?.message);
    }
  };

  const Menu__Static = [
    { menu: "New" },
    { menu: "All Offers" },
    { menu: "Meal Deals" },
    { menu: "Bundle Offers" },
    { menu: "Half Price" },
    { menu: "Buy One Add One Free" },
    { menu: "Summer Just for you" },
    { menu: "Top Offers" },
    { menu: "In Season" },
    { menu: "Eco Shop" },
    { menu: "Value Delivered" },
  ];

  const megaMenuOpen = (value) => {
    setActivemenu(value);
    setMegaMenu(true);
  };

  const openStaticMenu = () => {
    setMegaMenu(false);
  };

  useEffect(() => {
    setMegaMenu(false);
  }, [menu]);

  return (
    <div className="megamenu ">
      {menu === "catalog" ? (
        <ul className="megamenu__level1 accordion" id="accordionExample">
          <li
            className="desktopOnly"
            onMouseEnter={openStaticMenu}
            onClick={() => closeSideMenu()}
          >
            <a className="desktopOnly">Inspiration & Offers</a>
          </li>
          <li
            className="accordion-header mobileOnly"
            onMouseEnter={openStaticMenu}
          >
            <h2 className="accordion-header mobileOnly" id="headingOne">
              <button
                className="accordion-button collapsed"
                type="button"
                data-toggle="collapse"
                data-target="#static"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                <a className="accordion-button">Inspiration & Offers</a>
              </button>
            </h2>
            {Menu__Static?.length !== 0 ? (
              <div
                id="static"
                className="accordion-collapse collapse"
                aria-labelledby="headingOne"
                data-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <ul className="mobileOnly">
                    {Menu__Static?.map((item, i) => (
                      <li key={i}>{item.menu}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              ""
            )}
          </li>
          {CatalogCategoryies.map((item, i) => (
            <>
              <Link to={`/catalog/${item.id}`} key={i}>
                <li
                  onMouseEnter={() => megaMenuOpen(item.id)}
                  key={i}
                  onClick={() => closeSideMenu()}
                  className="desktopOnly"
                >
                  <a className="desktopOnly">{item.name}</a>
                </li>
              </Link>
              <li
                onMouseEnter={() => megaMenuOpen(item?.id)}
                key={i}
                className="accordion-header mobileOnly"
              >
                <h2
                  className="accordion-header mobileOnly"
                  id={`heading${item.name}`}
                >
                  <button
                    className={`${
                      item.children_data?.length !== 0
                        ? "accordion-button collapsed"
                        : "accordion-button closed"
                    }`}
                    type="button"
                    data-toggle="collapse"
                    data-target={`#${item.name}`}
                    aria-expanded="true"
                    aria-controls={item.name}
                  >
                    {item.children_data?.length !== 0 ? (
                      <Link
                        to={`/catalog/${item.id}`}
                        onClick={() => closeSideMenu()}
                        className="accordion-button"
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <Link
                        to={`/catalog/${item.id}`}
                        onClick={() => closeSideMenu()}
                        className="accordion-button"
                      >
                        {item.name}
                      </Link>
                    )}
                  </button>
                </h2>
                {item.children_data?.length !== 0 ? (
                  <div
                    id={item.name}
                    className="accordion-collapse collapse"
                    aria-labelledby={`heading${item.name}`}
                    data-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <ul className="mobileOnly">
                        {item.children_data?.map((item, i) => (
                          <Link
                            to={`/catalog/${item.id}`}
                            onClick={() => closeSideMenu()}
                            key={i}
                          >
                            <li key={i}>{item.name}</li>
                          </Link>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </li>
            </>
          ))}
        </ul>
      ) : (
        localStorage.getItem("companyid") && (
          <ul className="megamenu__level1 accordion " id="accordionExample">
            <li
              className="desktopOnly"
              onMouseEnter={openStaticMenu}
              onClick={() => closeSideMenu()}
            >
              <a className="desktopOnly">Inspiration & Offers</a>
            </li>
            <li
              className="accordion-header mobileOnly"
              onMouseEnter={openStaticMenu}
            >
              <h2 className="accordion-header mobileOnly" id="headingOne">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-toggle="collapse"
                  data-target="#static"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  <a className="accordion-button">Inspiration & Offers</a>
                </button>
              </h2>
              {Menu__Static?.length !== 0 ? (
                <div
                  id="static"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingOne"
                  data-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    <ul className="mobileOnly">
                      {Menu__Static?.map((item, i) => (
                        <li key={i}>{item.menu}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                ""
              )}
            </li>
            {CatalogCategoryies.map((item, i) => (
              <>
                <Link to={`/product/${item.id}`} key={i}>
                  <li
                    onMouseEnter={() => megaMenuOpen(item.id)}
                    key={i}
                    onClick={() => closeSideMenu()}
                    className="desktopOnly"
                  >
                    <a className="desktopOnly">{item.name}</a>
                  </li>
                </Link>
                <li
                  onMouseEnter={() => megaMenuOpen(item.id)}
                  key={i}
                  className="accordion-header mobileOnly"
                >
                  <h2
                    className="accordion-header mobileOnly"
                    id={`heading${item.name}`}
                  >
                    <button
                      className={`${
                        item.children_data?.length !== 0
                          ? "accordion-button collapsed"
                          : "accordion-button closed"
                      }`}
                      type="button"
                      data-toggle="collapse"
                      data-target={`#${item.name}`}
                      aria-expanded="true"
                      aria-controls={item.name}
                    >
                      {item.children_data?.length !== 0 ? (
                        <a className="accordion-button">
                          <Link
                            to={`/product/${item.id}`}
                            onClick={() => closeSideMenu()}
                          >
                            {item.name}
                          </Link>
                        </a>
                      ) : (
                        <Link
                          to={`/product/${item.id}`}
                          onClick={() => closeSideMenu()}
                        >
                          <a className="accordion-button">{item.name}</a>
                        </Link>
                      )}
                    </button>
                  </h2>
                  {item.children_data?.length !== 0 ? (
                    <div
                      id={item.name}
                      className="accordion-collapse collapse"
                      aria-labelledby={`heading${item.name}`}
                      data-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        <ul className="mobileOnly">
                          {item.children_data?.map((item, i) => (
                            <Link
                              to={`/product/${item.id}`}
                              onClick={() => closeSideMenu()}
                              key={i}
                            >
                              <li key={i}>{item.name}</li>
                            </Link>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </li>
              </>
            ))}
          </ul>
        )
      )}

      {!megamenu ? (
        <ul className="staticMenu desktopOnly">
          {Menu__Static?.map((item, i) => (
            <li key={i} onClick={() => closeSideMenu()}>
              {item.menu}
            </li>
          ))}
        </ul>
      ) : (
        <div className="megamenu__menus">
          {CatalogCategoryies.map((item, i) => (
            <div
              className={`${Activemenu === item.id ? "d-flex" : "d-none"}`}
              key={i}
            >
              <ul className="megamenu__level2 desktopOnly">
                {item.children_data.map((subitem, j) => (
                  <Link
                    to={`/${menu === "catalog" ? "catalog" : "product"}/${
                      subitem.id
                    }`}
                    key={j}
                  >
                    <li onClick={() => closeSideMenu()}>
                      <a className="desktopOnly">{subitem.name}</a>
                    </li>
                  </Link>
                ))}
              </ul>

              <ul className="megamenu__brands desktopOnly">
                <p>Inspiration Brand</p>
                <div>
                  {brands.map((data, i) => (
                    <li key={i}>
                      <img
                        src={`${request.image}/${data.image}`}
                        // alt={`brand${data.id}`}
                        alt=""
                      />
                    </li>
                  ))}
                </div>
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MegaMenu;
