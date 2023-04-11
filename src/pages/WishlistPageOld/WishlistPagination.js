import React from "react";
import "./pagination.scss"
// import leftarrow from '../../assets/images/leftarrow.png'
const WishlistPagination = (props) => {
    const { totalPostswi, postsPerPagewi, Paginate, currentPagewi } = props;
    let pages = [];
    const wpageincrement = () => {
      Paginate(currentPagewi + 1)
    }
    const wpagedecremnt = () => {
      Paginate(currentPagewi - 1)
    }
    for (var i = 1; i <= Math.ceil(totalPostswi / postsPerPagewi); i++) {
      pages.push(i)
    }
    return (
      <div className="pagination">
        <button className={currentPagewi == 1 ? 'wnotfrontarrow' : 'wfrontarrow'} onClick={wpagedecremnt}></button>
        {
          pages.map((page, index) => {
            return (
              <>
                <button key={index} onClick={() => Paginate(page)} className={page == currentPagewi ? 'active' : ''}>
                  {page}
                </button>
              </>
            )
          })
        }
        <button className={currentPagewi > 5 ? 'wdisplayarrow' : 'wnotdisplayarrow'} onClick={wpageincrement}>{">>"}</button>
      </div>
    )
}

export default WishlistPagination