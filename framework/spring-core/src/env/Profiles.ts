/**
 * Profile predicate that may be {@linkplain Environment#acceptsProfiles(Profiles)
 * accepted} by an {@link Environment}.
 *
 * <p>May be implemented directly or, more usually, created using the
 * {@link #of(String...) of(...)} factory method.
 */
export interface Profiles {

    /**
     * Test if this {@code Profiles} instance <em>matches</em> against the given
     * active profiles predicate.
     * @param activeProfiles predicate that tests whether a given profile is
     * currently active
     */
    matches: (activeProfiles: string) => boolean;
}

