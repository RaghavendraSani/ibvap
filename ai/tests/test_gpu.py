import torch

def main():
    print("PyTorch:", torch.__version__)
    print("CUDA available:", torch.cuda.is_available())

    if not torch.cuda.is_available():
        print("ERROR: CUDA GPU is not available.")
        return

    print("GPU:", torch.cuda.get_device_name(0))

    device = torch.device("cuda")
    a = torch.randn(3000, 3000, device=device)
    b = torch.randn(3000, 3000, device=device)
    c = torch.matmul(a, b)
    torch.cuda.synchronize()

    print("Tensor device:", c.device)
    print("GPU computation successful.")

if __name__ == "__main__":
    main()