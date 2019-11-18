

/**
 * This interface represents the abstract notion of a principal, which
 * can be used to represent any entity, such as an individual, a
 * corporation, and a login id.
 *
 */
export interface Principal {
    /**
     * Returns the name of this principal.
     *
     * @return the name of this principal.
     */
      getName:()=>string;

}
