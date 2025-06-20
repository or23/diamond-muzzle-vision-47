import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";
import { useState } from "react";

interface Transaction {
  id: number;
  date: string;
  diamond: string;
  price: number;
  status: string;
  customer: string;
}

interface TransactionsTableProps {
  title: string;
  description?: string;
  transactions: Transaction[];
  loading?: boolean;
}

export function TransactionsTable({ 
  title, 
  description, 
  transactions, 
  loading = false 
}: TransactionsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredTransactions = transactions.filter(transaction => 
    transaction.diamond.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Card className="bg-white border border-[#E9ECEF] shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-[#2D3436] text-lg font-bold">{title}</CardTitle>
            {description && <CardDescription className="text-[#6C757D]">{description}</CardDescription>}
          </div>
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Search transactions..." 
              className="h-8 text-xs border-[#E9ECEF] text-[#6C757D] w-[180px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="ghost" size="sm" className="text-[#6C757D] hover:text-[#2D3436]">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-[#F8F9FA] animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E9ECEF]">
                    <th className="text-left py-3 px-4 text-xs font-medium text-[#6C757D]">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[#6C757D]">Diamond</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[#6C757D]">Customer</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-[#6C757D]">Price</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-[#6C757D]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-[#F1F3F5] hover:bg-[#F8F9FA]">
                      <td className="py-3 px-4 text-sm text-[#2D3436]">{transaction.date}</td>
                      <td className="py-3 px-4 text-sm text-[#2D3436] font-medium">{transaction.diamond}</td>
                      <td className="py-3 px-4 text-sm text-[#2D3436]">{transaction.customer}</td>
                      <td className="py-3 px-4 text-sm text-[#2D3436] text-right font-medium">${transaction.price.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">
                        <Badge 
                          className={`${
                            transaction.status === 'Completed' 
                              ? 'bg-[#E9F7EF] text-[#28A745] hover:bg-[#D4EDDA]' 
                              : 'bg-[#FFF3CD] text-[#FFC107] hover:bg-[#FFE8A1]'
                          } border-none`}
                        >
                          {transaction.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" className="text-[#007BFF] border-[#E9ECEF] hover:bg-[#F1F3F5] hover:text-[#0056b3]">
                View All Transactions
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}