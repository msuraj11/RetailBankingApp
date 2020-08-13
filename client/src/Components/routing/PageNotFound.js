import React, {Fragment} from 'react';
import notFound from '../../img/notFound.gif';

export default () => {
    return <Fragment>
        <h1 className='large text-primary'>Oops...!! Something is wrong.</h1>
        <img 
            src={notFound}
            style={{ width: '100%', margin: 'auto', display: 'block' }}
            alt='404-not-found'
        />
    </Fragment>;
};
