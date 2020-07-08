import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';

class StatementTable extends PureComponent {
    render () {
        const {data} = this.props;
        return (
            <Fragment>
                <h2 className="my-2">StatementTable</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>S.No.</th>
                            <th className="hide-sm">Transaction-type</th>
                            <th className="hide-sm">Amount Cr/Dr</th>
                            <th className="hide-sm">Transacted-Date</th>
                            <th className="hide-sm">Transacted for</th>
                            <th>Balance after TX</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        data && data.map((item, key) => (
                            <tr key={item._id}>
                                <td>{key+1}</td>
                                <td className="hide-sm">{item.txType}</td>
                                <td className="hide-sm">{item.txAmount}</td>
                                <td className="hide-sm">{moment(item.txDates).format('DD-MM-YYYY HH:mm:ss')}</td>
                                <td className="hide-sm">{item.txBy}</td>
                                <td>{item.currentBalance}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </Fragment>
        );
    }
};

export default StatementTable;
