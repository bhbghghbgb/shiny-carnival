using FluentValidation;
using RetailStoreManagement.Models.DTOs.Orders;

namespace RetailStoreManagement.Validators;

public class CreateOrderRequestValidator : AbstractValidator<CreateOrderRequest>
{
    public CreateOrderRequestValidator()
    {
        RuleFor(x => x.CustomerId)
            .GreaterThan(0).WithMessage("Customer ID must be greater than 0");

        RuleFor(x => x.OrderItems)
            .NotEmpty().WithMessage("Order must have at least one item")
            .Must(items => items != null && items.Count > 0)
            .WithMessage("Order items cannot be empty");

        RuleForEach(x => x.OrderItems)
            .SetValidator(new OrderItemInputValidator());

        RuleFor(x => x.PromoCode)
            .MaximumLength(50).WithMessage("Promo code must not exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.PromoCode));
    }
}

public class OrderItemInputValidator : AbstractValidator<OrderItemInput>
{
    public OrderItemInputValidator()
    {
        RuleFor(x => x.ProductId)
            .GreaterThan(0).WithMessage("Product ID must be greater than 0");

        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Quantity must be greater than 0");
    }
}
