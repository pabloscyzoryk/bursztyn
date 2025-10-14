// imports

// ui
import { InputGroup, Input } from "@chakra-ui/react";
import { Search } from "lucide-react";

export const SearchBar = ({ searchQuery, setSearchQuery }: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) => (
  <InputGroup mb={6} mt={2} maxW="40%" flex="1" startElement={<Search />}>
    <Input
      placeholder="Znajdź krzyżówkę..."
      value={searchQuery}
      onChange={e => setSearchQuery(e.target.value)}
    />
  </InputGroup>
);