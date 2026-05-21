interface SearchParams {
    after?: string;
    before?: string;
    first?: string;
    last?: string;
}
export interface useSearchParams {
    searchParams: SearchParams;
    dataCount: number;
}

const useSearchParams = ({ searchParams, dataCount }: useSearchParams) => {
    const first = searchParams.first
        ? parseInt(searchParams.first, 10)
        : searchParams.last
          ? null
          : dataCount;
    const last = searchParams.last
        ? parseInt(searchParams.last, 10)
        : searchParams.first
          ? null
          : dataCount;

    return {
        first,
        after: searchParams.after || null,
        last,
        before: searchParams.before || null,
    };
};

export default useSearchParams;
