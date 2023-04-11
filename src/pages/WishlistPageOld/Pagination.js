import React from "react";
import "./pagination.scss"

const Pagination = (props) => {
    const { totalPosts, postsPerPage, Favpaginate, currentPage } = props;
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
            <button className={currentPage == 1 ? 'notfrontarrow' : 'frontarrow'} onClick={pagedecremnt}>{"<<"}</button>
            {

                pages.map((page, index) => {
                    return (
                        <>
                            <button key={index} onClick={() => Favpaginate(page)} className={page == currentPage ? 'active' : ''}>
                                {page}

                            </button>
                        </>
                    )
                })
            }
            <button className={currentPage > 5 ? 'displayarrow' : 'notdisplayarrow'} onClick={pageincrement}>{">>"}</button>
        </div>
    )
}

export default Pagination