describe("test promise", () => {

    const sleep = (times) => {
        return new Promise((resolve) => {
            setTimeout(resolve, times)
        })
    }

    // const sleep = async (times, resolve):Promise<number> => {
    //
    //    // throw new Error("111")
    //    //  setTimeout(resolve, times)
    //
    //     return  1;
    // };


    test("test 1", async () => {

        sleep(1).then((data)=>{

        }).finally(()=>{
            console.log("")
        })

        try {
            const x = await sleep(100);
            console.log("==>", x);
        } catch (e) {
            console.log(e);
        }
        // console.log("==>", x);


    }, 2 * 1000)


});
