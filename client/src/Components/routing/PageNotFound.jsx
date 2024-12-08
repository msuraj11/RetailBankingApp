import React from 'react';
import notFound from '../../img/notFound.gif';

const PageNotFound = () => {
  return (
    <React.Fragment>
      <h1 className="text-center text-primary">Oops...!! Sorry the page you are looking for isn't found.</h1>
      <img src={notFound} style={{width: '50%', margin: 'auto', display: 'block'}} alt="404-not-found" />
    </React.Fragment>
  );
};

export default PageNotFound;
