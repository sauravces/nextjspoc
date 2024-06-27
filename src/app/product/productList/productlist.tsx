"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Typography,
  Stack,
  IconButton
} from "@mui/material";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/app/actions/actions";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
}
export interface ProductTableProps {
  initialProducts: Product[];
}

export default function ProductTable({ initialProducts }: ProductTableProps) {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const handleDeleteClick = (product: Product, event: React.MouseEvent) => {
    event.stopPropagation();
    setIsDeleteDialogOpen(true);
    setSelectedProduct(product);
  };

  const handleDeleteConfirm = async () => {
    if (selectedProduct) {
      const { success, message } = await deleteProduct(
        selectedProduct.id
      );
      if (success) {
        setProducts(
          products.filter((product) => product.id !== selectedProduct.id)
        );
        toast({
          variant: "default",
          description: message,
        });
        setIsDeleteDialogOpen(false);
      }
      if (message && !success) {
        toast({
          variant: "destructive",
          description: `${message}`,
        });
      }
    }
  };

  return (
    <>
      <Stack direction="row" sx={{ padding: "7px", alignItems: "center" }}>
        <Typography sx={{ padding: "20px", font: "bold", flexGrow: 1 }}>
          Products
        </Typography>
        <Button size="sm" onClick={() => router.push("/product/createProduct")}>
          Create Product
        </Button>
      </Stack>
      <Table className="m-3 p-3 rounded-s border-black outline-1 shadow-md">
        <TableHeader className="bg-slate-50 ">
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>
                <Stack direction="row">
                  <IconButton
                    size="small"
                    onClick={(event) => handleDeleteClick(product, event)}
                  >
                    <DeleteIcon sx={{ color: "#ef5350" }} />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
