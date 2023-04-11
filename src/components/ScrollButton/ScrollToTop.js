import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useStateValue } from "../../store/state";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const [{ scroll }] = useStateValue();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, scroll]);

  return null;
}
