import {Link} from "umi";
import React from "react";


const ReactTestRenderer = require('react-test-renderer');


describe("umi antd v4 route config generator", () => {


    test("test umi route config", () => {
        const renderer = ReactTestRenderer.create(
            <Link to="https://www.facebook.com/">Facebook</Link>
        );

        console.log(renderer.toJSON());

    })
});
