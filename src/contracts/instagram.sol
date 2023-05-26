pragma solidity ^0.5.0;

contract Instagram {
  string public name;
  uint public imageCount = 0;
  mapping(uint => Image) public images;

  struct Image {
    uint id;
    string hash;
    string description;
    string ganre;
    uint tipAmount;
    uint countLiks;
    address payable author;
  }

  constructor() public {
    name = "Instagram";
  }

  function uploadImage(string memory _imgHash, string memory _description, string memory _ganre) public {
    require(bytes(_imgHash).length > 0);
    require(bytes(_description).length > 0);
    require(bytes(_ganre).length > 0);
    require(msg.sender!=address(0));

    imageCount++;
    
    images[imageCount] = Image(imageCount, _imgHash, _description,_ganre, 0, 0, msg.sender);
  }

  function tipImageOwner(uint _id) public payable {
    require(_id > 0 && _id <= imageCount);

    Image memory _image = images[_id];
  
    address payable _author = _image.author;
    
    address(_author).transfer(msg.value);
 
    _image.tipAmount = _image.tipAmount + msg.value;

    _image.countLiks++;
  
    images[_id] = _image;
  }
}
