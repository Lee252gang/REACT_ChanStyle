import React, { useEffect } from "react"; 
import PropTypes from "prop-types"; 
import { Route, Switch, withRouter } from "react-router-dom"; 
import Main from "../Routes/Main";
import MyPage from "../Routes/Mypage";
import Auth from "../Routes/Auth";
import Store from "../Routes/Store/Store";
import Product from "../Routes/Product";
import Payment from "../Routes/Payment";
import Admin from "../Routes/Admin/Admin";
import { useQuery, useMutation } from "react-apollo-hooks";
import { SEE_PAYMENT } from './../Routes/Payment/PaymentQueries';
import { DELETE_PAYMENT } from "./SharedQueries";

const AppRouter = withRouter(({ isLoggedIn, isAdmin, location }) => {
    let idArrayTemp = []; 
    const { loading, data } = useQuery(SEE_PAYMENT, {fetchPolicy: "network-only"}); 
    const deletePaymentMutation = useMutation(DELETE_PAYMENT, { variables: {
        id:idArrayTemp
    }})

    const deletePaymentFunction = async () => {
        const { data } = await deletePaymentMutation(); 
        if(data) {
            //window.location.reload();
            idArrayTemp = [];
        }
    }

    // 다른 페이지로 이동할 때마다 payment필드에 값이 있으면 제거한다. 
    useEffect(() => {
        if(location.pathname !== "/payment") {
            if (loading === false && data.seePayment.length !== 0) {
                data.seePayment.map(item => (
                    idArrayTemp.push(item.id)
                ))
                if(idArrayTemp !== []){
                    deletePaymentFunction();
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[location])
    return (
        <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/store" component={Store} />
            <Route exact path="/payment" component={Payment} />
            <Route path = "/product/:productid" component={Product} onUpdate={() => console.log(123)} />
            <Route path = "/:userId" component={ isLoggedIn ? (isAdmin ? Admin : MyPage) : Auth} /> 
        </Switch>
    )
})

// Router는 항상 proptypes를 가져야 함 
AppRouter.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired
}

export default AppRouter;