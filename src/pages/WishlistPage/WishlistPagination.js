import React from "react";
import "./pagination.scss"
// import leftarrow from '../../assets/images/leftarrow.png'
const WishlistPagination = (props) => {
    const { totalPostswi, postsPerPagewi, Paginate, currentPagewi } = props;
    console.log("wishlistPage page", currentPagewi);
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
            <span className={currentPagewi == 1 ? 'wnotfrontarrow' : 'wfrontarrow'} onClick={wpagedecremnt}>
                {"<"}
            </span>
            
            {
              
                pages.map((page, index) => {

                    return (
                        <>
                            <span key={index} onClick={() => Paginate(page)} className={page == currentPagewi ? 'active' : ''}>
                                {page}
                            </span>
                        </>
                    )
                })
            }
            {
                pages.length >1  && currentPagewi != pages.length ? (
                        <>
                         <span className='wdisplayarrow' onClick={wpageincrement}>{">"}</span>
                       </>
                ):""
            }
             {
                pages.length >1  && currentPagewi == pages.length ? (
                        <>
                         <span className='wnotdisplayarrow' onClick={wpageincrement}>{">"}</span>
                       </>
                ):""
            }
            {/* <span className={pages.length > 1 && currentPagewi==pages.length ? 'wdisplayarrow' : 'wnotdisplayarrow'}  onClick={wpageincrement}>{">"}</span> */}
        </div>
    )
}

export default WishlistPagination