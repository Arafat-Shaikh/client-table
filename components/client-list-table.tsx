"use client";

import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SortPanel from "./sort-panel";
import type { Client, SortCriterion } from "@/types/client";
import { generateMockClients } from "@/lib/mock-data";

export default function ClientListTable() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "individual" | "company">(
    "all"
  );
  const [sortCriteria, setSortCriteria] = useState<SortCriterion[]>([]);
  const [isSortPanelOpen, setIsSortPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const mockClients = generateMockClients(20);
    setClients(mockClients);
    setFilteredClients(mockClients);

    const savedSortCriteria = localStorage.getItem("clientTableSortCriteria");
    if (savedSortCriteria) {
      try {
        setSortCriteria(JSON.parse(savedSortCriteria));
      } catch (error) {
        console.error("Failed to parse saved sort criteria:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "clientTableSortCriteria",
      JSON.stringify(sortCriteria)
    );
  }, [sortCriteria]);

  useEffect(() => {
    let result = [...clients];

    if (activeTab !== "all") {
      result = result.filter(
        (client) => client.type.toLowerCase() === activeTab
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (client) =>
          client.name.toLowerCase().includes(query) ||
          client.email.toLowerCase().includes(query) ||
          client.id.toString().includes(query)
      );
    }

    if (sortCriteria.length > 0) {
      result = [...result].sort((a, b) => {
        for (const criterion of sortCriteria) {
          let comparison = 0;

          switch (criterion.field) {
            case "name":
              comparison = a.name.localeCompare(b.name);
              console.log("name: ", comparison);
              break;
            case "id":
              comparison = a.id - b.id;
              console.log("id: ", comparison);
              break;
            case "createdAt":
              comparison =
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime();
              console.log("createdAt: ", comparison);

              break;
            case "updatedAt":
              comparison =
                new Date(a.updatedAt).getTime() -
                new Date(b.updatedAt).getTime();
              console.log("updatedAt: ", comparison);

              break;
            default:
              comparison = 0;
              console.log("default: ", comparison);
          }

          if (comparison !== 0) {
            console.log("Comparison: ", comparison);
            console.log(comparison);
            console.log(-comparison);
            return criterion.direction === "asc" ? comparison : -comparison;
          }
        }
        return 0;
      });
    }

    // if comparison is 1 then we are assigning -1,
    // if comparison is -1 then we are making -(-1) = 1 for descending order

    // let tempArr = [1, 2, 4, 3];

    // let asc = [...tempArr].sort((a: any, b: any) => a - b);
    // console.log("ASC: ", asc);     [1, 2, 3, 4]

    // let desc = [...tempArr].sort((a: any, b: any) => b - a);
    // console.log("DESC: ", desc);   [4, 3, 2, 1]

    // example
    // let tempArr = [
    //   { id: "1", name: "apple" },
    //   { id: "2", name: "banana" },
    //   { id: "3", name: "apple" },
    // ];

    // let sortBy = ["name", "id"];

    // let direction = "asc";

    // tempArr = [...tempArr].sort((a: any, b: any) => {
    //   for (const sort of sortBy) {
    //     let comp = 0;
    //     if (sort === "name") {
    //       comp = a.name.localeCompare(b.name);
    //     } else if (sort === "id") {
    //       comp = a.id - b.id;
    //     }

    //     if (comp !== 0) {
    //       return direction === "asc" ? comp : -comp;
    //     }
    //   }
    //   return 0;
    // });
    // console.log(tempArr);

    setFilteredClients(result);
  }, [clients, activeTab, sortCriteria, searchQuery]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as "all" | "individual" | "company");
  };

  const handleSortChange = (newSortCriteria: SortCriterion[]) => {
    setSortCriteria(newSortCriteria);
  };

  const toggleSortPanel = () => {
    setIsSortPanelOpen(!isSortPanelOpen);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-400";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Clients</h1>
      <div className="border-b pb-2" />

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row gap-2 items-center justify-between">
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={handleTabChange}
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="individual">Individual</TabsTrigger>
              <TabsTrigger value="company">Company</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-[200px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button
              className="relative"
              variant="outline"
              size="icon"
              onClick={toggleSortPanel}
            >
              <Filter className="h-4 w-4" />
              {sortCriteria.length !== 0 && (
                <span className="absolute z-10 -top-3 -right-2 bg-red-600 border border-black/20 shadow-md px-1.5 rounded-full text-white text-xs">
                  {sortCriteria.length}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="relative">
          {isSortPanelOpen && (
            <SortPanel
              sortCriteria={sortCriteria}
              onSortChange={handleSortChange}
              onClose={() => setIsSortPanelOpen(false)}
            />
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Client ID</TableHead>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Client Type</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead>Updated By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium text-primary">
                      {client.id}
                    </TableCell>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.type}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${getStatusColor(
                            client.status
                          )}`}
                        />
                        {client.status}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(client.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(client.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{client.updatedBy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
