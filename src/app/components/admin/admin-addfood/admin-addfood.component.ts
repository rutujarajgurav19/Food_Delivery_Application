import { Component, OnInit } from '@angular/core'; 
import { OnlinefoodService } from '../../service/onlinefood.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../model/product.model';
import { take } from 'rxjs';

@Component({
  standalone:false,
  selector: 'app-admin-addfood',
  templateUrl: './admin-addfood.component.html',
  styleUrls: ['./admin-addfood.component.css']
})
export class AdminAddfoodComponent  implements OnInit {
[x: string]: any;

  productid: string = '';
  image: string = '';
  description: string = '';
  mrpPrice: number = 0;
  quantity: number = 0;
  isEdit: boolean = false;
  productId: any;
  getCategoryList: any[] = [];
  category: number = 0;
  onReset: any;
  successMessage: any;
  errorMessage: any;
  onImageUpload: any;
productname: any;

  constructor(
    private oService: OnlinefoodService,
    private router: Router,
    private activateRouter: ActivatedRoute
  ) {
    this.activateRouter.queryParams.subscribe((params: any) => {
      if (params?.id) {
        this.isEdit = true;
        this.oService.getProductById(params?.id).pipe(take(1)).subscribe((res: any) => {
          if (!!res && res?.productId) {
            const product: Product = res;
            console.log('>>>>', product);
            this.productid = product?.productname;
            this.description = product?.description;
            this.image = product?.image;
            this.mrpPrice = product?.mrpPrice;
            this.quantity = product?.quantity;
            this.productId = product?.productId;
            const categoryName = this.getCategoryList.find((cate: any) => cate?.name.toString() === product?.category)?.value;
            this.category = categoryName;
          }
          console.log(res);
        });
      }
    });
  }

  ngOnInit(): void {
    this.oService.isAdminLoginPresent();
    this.getCategoryList = this.oService.getCategoryList();
  }

  isValidUrl(url: string): boolean {
    const pattern = new RegExp('^(https?:\/\/[^\s$.?#].[^\s]*)$', 'i');
    return pattern.test(url);
  }

  onAddProduct(): void {
   if (this.productname === '') {
      alert("Product name is required");
      return;
    }
    if (this.description === '') {
      alert("Description is required");
      return;
    }
    if (this.image === '') {
      alert("Image should not be blank");
      return;
    }
    if (!this.isValidUrl(this.image) && this.image.length < 5) {
      alert("Invalid image URL or file path");
      return;
    }
    if (this.mrpPrice === 0 || this.mrpPrice === null) {
      alert("MRP Price should not be zero/blank");
      return;
    }
    if (this.quantity === 0 || this.quantity === null) {
      alert("Quantity should not be zero/blank");
      return;
    }
  
    const body: any = {
      productId: this.productid, // Ensure field names match backend
      productname: this.productname,
      image: this.image,
      description: this.description,
      mrpPrice: this.mrpPrice,
      quantity: this.quantity,
      category: this.category,
    };
  
    console.log("Payload: ", body);
  
    if (this.isEdit) {
      this.oService.editProduct(body, this.productId).pipe(take(1)).subscribe(
        (res: any) => {
          console.log("Response: ", res);
          if (res && res?.productId) {
            alert("Product updated successfully");
            this.router.navigate(["/admin/listproduct"]);
          }
        },
        (err) => {
          console.error("Error: ", err);
          const errorMessage = err?.error?.message || "Something went wrong! Please try again";
          alert(errorMessage);
        }
      );
    } else {
      this.oService.addProduct(body).pipe(take(1)).subscribe(
        (res: any) => {
          console.log("Response: ", res);
          if (res && res?.productId) {
            alert("Product added successfully");
            this.router.navigate(["/admin/listproduct"]);
          }
        },
        (err) => {
          console.error("Error: ", err);
          const errorMessage = err?.error?.message || "Something went wrong! Please try again";
          alert(errorMessage);
        }
      );
    }
  }
}