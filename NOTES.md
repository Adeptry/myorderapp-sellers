```
export function useNetwork<O, I = void>(
  networkingFunction?: (input?: I) => Promise<O>
) {
  const [requestState, setRequestState] = useState<
    [O | undefined, any | undefined, boolean]
  >([undefined, undefined, false]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setRequestState([undefined, undefined, true]);
        const response = networkingFunction && (await networkingFunction());
        setRequestState([response, undefined, false]);
      } catch (error) {
        console.log(`${error}`);
        setRequestState([undefined, error, false]);
      }
    };

    if (networkingFunction) {
      fetchData();
    }
  }, [networkingFunction]);

  const [data, error, loading] = requestState;

  return { data, loading, error };
}
```
