/**
 * 扩展promise的定义
 */


interface Promise<T = any> {

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;

    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;


    /**
     *
     * @param {((value: T) => (PromiseLike<TResult1> | TResult1)) | null | undefined} onfulfilled
     * @param {((reason: any) => (PromiseLike<TResult2> | TResult2)) | null | undefined} onrejected
     * @return
     */
    done<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): void;

    /**
     * finally
     * @param {(() => void) | null | undefined} onfinally
     * @return {Promise<T>}
     */
    finally(onfinally?: ((value: T) => void) | undefined | null): Promise<T>

}

