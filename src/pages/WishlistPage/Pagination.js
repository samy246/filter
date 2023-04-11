import React from "react";
import "./pagination.scss"

const Pagination = (props) => {
    const { totalPosts, postsPerPage, Favpaginate, currentPage } = props;
    console.log("totalposts",totalPosts);
    let pages = [];

    const pageincrement = () => {
        Favpaginate(currentPage + 1)
    }

    const pagedecremnt = () => {
        Favpaginate(currentPage - 1)
    }

    for (var i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pages.push(i)
    }
    return (
        <div className="pagination">
            <span className={currentPage == 1 ? 'notfrontarrow' : 'frontarrow'} onClick={pagedecremnt}>{"<"}</span>
            {
                pages.map((page, index) => {
                    return (
                        <>
                            <span key={index} onClick={() => Favpaginate(page)} className={page == currentPage ? 'active' : ''}>
                                {page}
                            </span>
                        </>
                    )
                })
            }
              {
                pages.length >1  && currentPage != pages.length ? (
                        <>
                         <span className='displayarrow' onClick={pageincrement}>{">"}</span>
                       </>
                ):""
            }
             {
                pages.length >1  && currentPage == pages.length ? (
                        <>
                         <span className='notdisplayarrow' onClick={pageincrement}>{">"}</span>
                       </>
                ):""
            }
            {/* <span className={pages.length > 1 &&currentPage ==1 ? 'displayarrow' : 'notdisplayarrow'} onClick={pageincrement}>{">"}</span> */}
            
        </div>
    )
}

export default Pagination