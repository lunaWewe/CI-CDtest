package tw.luna.FinalTest.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import org.hibernate.annotations.DynamicUpdate;

import java.util.HashSet;
import java.util.Set;

//cart表結構:cartId、userId、total、totalQuantity、status
//建構式、getter setter

@DynamicUpdate
@Entity
@Table(name = "cart")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cartId",nullable = false)
    private Integer cartId;

    @OneToOne
    @JoinColumn(name = "userId",nullable = false)
    @JsonBackReference("Users_Cart")
    private Users users;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("Cart_CartItems")
    private Set<CartItems> cartItems = new HashSet<>();

	public Cart() {
    }

    public Cart(Integer cartId, Users users, Set<CartItems> cartItems) {
        this.cartId = cartId;
        this.users = users;
        this.cartItems = cartItems;
    }

    public Integer getCartId() {
        return cartId;
    }

    public void setCartId(Integer cartId) {
        this.cartId = cartId;
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    public Set<CartItems> getCartItems() {
        return cartItems;
    }

    public void setCartItems(Set<CartItems> cartItems) {
        this.cartItems = cartItems;
    }

    @Override
    public String toString() {
        return "Cart{" +
                "cartId=" + cartId +
                '}';
    }
}
