import React, {Component} from "react";
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import LexChat from "react-lex-plus";

class OnlineSupport extends Component {
  render() {
      return (
        <div>
          <LexChat 
          botName="SafeDepositBot"
          IdentityPoolId="us-east-1:775870fd-c86f-4163-b789-bbe793cad0c3"
          placeholder="Type Here"
          backgroundColor="#FFFFFF"
          height="430px"

          region="us-east-1"
          headerText="SafeDeposit Online Support"
          headerStyle={{ backgroundColor: "#000000", fontSize: "20px" }}
          greeting={
            "Hi There! How are you doing!"
          }
        />
        <Button color="secondary" variant="contained" fullWidth type="submit">
          <Link to={"/register"} style={{ color: "#FFFFFF", fontSize: "100%" }}>Go Back</Link>
        </Button>
      </div>
      )
  }
}
export default OnlineSupport;